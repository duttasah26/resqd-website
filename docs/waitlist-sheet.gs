/**
 * ResQd waitlist -> Google Sheet writer (Google Apps Script).
 *
 * This is the site's entire backend. The Next.js route /api/waitlist POSTs
 * one JSON object per signup to the web app deployed from this script, and it
 * appends a row to the sheet. No SDK, no OAuth, no service-account key.
 *
 * ── Setup ────────────────────────────────────────────────────────────────
 * 1. Create a Google Sheet. Put these headers in row 1, in this order:
 *
 *      Email | Organization | Role | Submitted at (UTC)
 *
 * 2. In the sheet: Extensions -> Apps Script. Delete the default code and
 *    paste this whole file.
 *
 * 3. On the `var SECRET =` line below, replace ONLY the text between the quotes
 *    with a long random string (e.g. `openssl rand -base64 24`). Do not touch
 *    anything else. Use the SAME value for the WAITLIST_SHEET_SECRET env var in
 *    Vercel and in .env.local.
 *
 * 4. Deploy -> New deployment -> select type "Web app".
 *      Description:      resqd waitlist
 *      Execute as:       Me
 *      Who has access:   Anyone
 *    Authorize when prompted. Copy the "Web app" URL (ends in /exec) into the
 *    WAITLIST_SHEET_URL env var in Vercel and .env.local.
 *
 * 5. After ANY later edit to this script, redeploy the SAME deployment so the
 *    URL stays stable: Deploy -> Manage deployments -> (pencil) Edit ->
 *    Version: "New version" -> Deploy. Do not use "New deployment" (new URL).
 *
 * ── Test ────────────────────────────────────────────────────────────────
 *   curl -L "<WEB_APP_URL>"                       -> {"ok":true,"service":"resqd-waitlist"}
 *   curl -L -X POST "<WEB_APP_URL>" \
 *     -H 'Content-Type: application/json' \
 *     -d '{"secret":"<SECRET>","email":"a@b.com","organization":"Test","role":"Other","submittedAt":"2026-01-01T00:00:00Z"}'
 */

var SECRET = 'REPLACE_WITH_A_LONG_RANDOM_STRING';
var SHEET_NAME = 'Sheet1'; // the tab to append to; leave as-is if unrenamed

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Reject if the secret is unset/too short, or does not match the request.
    // (Length check, not an equality check against the placeholder, so a
    // find/replace of the placeholder can't accidentally disable this guard.)
    if (!SECRET || SECRET.length < 16 || body.secret !== SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }

    var email = String(body.email || '').trim();
    var organization = String(body.organization || '').trim();
    var role = String(body.role || '').trim();
    var submittedAt = String(body.submittedAt || new Date().toISOString());

    if (!email || !organization || !role) {
      return json({ ok: false, error: 'missing fields' });
    }

    var sheet =
      SpreadsheetApp.getActive().getSheetByName(SHEET_NAME) ||
      SpreadsheetApp.getActive().getSheets()[0];

    // Serialize concurrent web-app invocations so rows never interleave.
    var lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      sheet.appendRow([email, organization, role, submittedAt]);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'resqd-waitlist' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

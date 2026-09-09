export interface WaitlistRow {
  email: string;
  organization: string;
  role: string;
  submittedAt: string;
}

/*
 * The only backend the site has: one signup -> one row in a Google Sheet.
 *
 * The sheet is fronted by a Google Apps Script web app (source in
 * docs/waitlist-sheet.gs). It accepts a POST of
 *   { secret, email, organization, role, submittedAt }
 * and appends a row. No SDK, no OAuth, no service-account private key: the
 * request is authenticated by a shared secret that both sides hold.
 *
 * Set in Vercel (and .env.local for dev):
 *   WAITLIST_SHEET_URL     - the deployed web-app URL (…/exec)
 *   WAITLIST_SHEET_SECRET  - a long random string, same value in the script
 */
const ENDPOINT = process.env.WAITLIST_SHEET_URL;
const SECRET = process.env.WAITLIST_SHEET_SECRET;

export async function appendWaitlistRow(row: WaitlistRow): Promise<void> {
  if (!ENDPOINT || !SECRET) {
    throw new Error(
      "Waitlist sheet is not configured (WAITLIST_SHEET_URL / WAITLIST_SHEET_SECRET).",
    );
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: SECRET, ...row }),
    // Apps Script answers with a 302 to script.googleusercontent.com; follow it.
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Sheet writer returned ${res.status}`);
  }

  const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!body?.ok) {
    throw new Error("Sheet writer rejected the request");
  }
}

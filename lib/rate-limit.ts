/**
 * Tiny in-memory sliding-window rate limiter.
 *
 * Best-effort by design: serverless instances do not share memory, so the true
 * ceiling is (limit x number of warm instances). The site has no datastore to
 * back a shared limiter, and this is still enough to stop a single client from
 * hammering the waitlist endpoint and burning the Apps Script runtime quota.
 * For a determined distributed flood, turn on Vercel's platform protection
 * (Project -> Firewall / Attack Challenge Mode).
 */

interface Window {
  count: number;
  /** epoch ms when this window resets */
  reset: number;
}

const windows = new Map<string, Window>();

export interface RateLimitResult {
  ok: boolean;
  /** requests left in the current window (0 when blocked) */
  remaining: number;
  /** seconds until the window resets (0 when not blocked) */
  retryAfter: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.reset <= now) {
    windows.set(key, { count: 1, reset: now + windowMs });
    // Opportunistically drop expired entries so the map can't grow unbounded.
    if (windows.size > 5000) {
      for (const [k, v] of windows) if (v.reset <= now) windows.delete(k);
    }
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  current.count += 1;
  const retryAfter = Math.ceil((current.reset - now) / 1000);

  if (current.count > limit) {
    return { ok: false, remaining: 0, retryAfter };
  }
  return { ok: true, remaining: limit - current.count, retryAfter };
}

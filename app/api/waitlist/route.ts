import { NextResponse } from "next/server";
import { z } from "zod";
import { appendWaitlistRow } from "@/lib/waitlist";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Per-IP: a real person submits once, maybe retries a couple of times.
const PER_IP_LIMIT = 6;
const PER_IP_WINDOW_MS = 60_000;
// Whole-endpoint ceiling, to cap load on the Google Apps Script backend.
const GLOBAL_LIMIT = 100;
const GLOBAL_WINDOW_MS = 60_000;

const schema = z.object({
  email: z.email().max(200),
  organization: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(120),
  company: z.string().optional(), // honeypot; real people never fill this
});

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function tooMany(retryAfter: number) {
  return NextResponse.json(
    { error: "Too many attempts. Please wait a minute and try again." },
    { status: 429, headers: { "Retry-After": String(Math.max(retryAfter, 1)) } },
  );
}

export async function POST(req: Request) {
  const perIp = rateLimit(
    `waitlist:ip:${clientIp(req)}`,
    PER_IP_LIMIT,
    PER_IP_WINDOW_MS,
  );
  if (!perIp.ok) return tooMany(perIp.retryAfter);

  const global = rateLimit("waitlist:global", GLOBAL_LIMIT, GLOBAL_WINDOW_MS);
  if (!global.ok) return tooMany(global.retryAfter);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your details and try again." },
      { status: 400 },
    );
  }

  const { email, organization, role, company } = parsed.data;

  // Bot filled the honeypot: accept quietly, store nothing.
  if (company && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    await appendWaitlistRow({
      email,
      organization,
      role,
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("waitlist append failed", err);
    return NextResponse.json(
      { error: "Could not save right now. Try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

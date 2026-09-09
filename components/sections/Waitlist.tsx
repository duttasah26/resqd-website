"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Section } from "@/components/ui/Section";
import { waitlist } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

export function Waitlist() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") ?? "").trim(),
      organization: String(data.get("organization") ?? "").trim(),
      role: String(data.get("role") ?? "").trim(),
      company: String(data.get("company") ?? ""), // honeypot
    };

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Something went wrong. Try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <Section id="waitlist" className="py-24 sm:py-32">
      <div className="ember-glow overflow-hidden rounded-2xl border border-border bg-surface/60 p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="font-display text-4xl font-bold leading-[1.03] tracking-tight text-text sm:text-5xl">
              {waitlist.heading}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              {waitlist.body}
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-xl border border-safe/40 bg-safe/10 p-8 text-center">
              <p className="font-display text-xl font-semibold text-text">
                {waitlist.successTitle}
              </p>
              <p className="mt-2 text-sm text-muted">{waitlist.successBody}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Field
                name="email"
                type="email"
                label="Work email"
                placeholder="you@department.gov"
                required
                autoComplete="email"
              />
              <Field
                name="organization"
                type="text"
                label="Organization"
                placeholder="e.g. Toronto Fire Services"
                required
                autoComplete="organization"
              />
              <div>
                <label
                  htmlFor="wl-role"
                  className="label mb-1.5 block text-muted"
                >
                  Role
                </label>
                <select
                  id="wl-role"
                  name="role"
                  required
                  defaultValue=""
                  className="h-11 w-full rounded-lg border border-border bg-bg px-3 text-sm text-text outline-none focus:border-urgent"
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {waitlist.roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* honeypot: hidden from people, catches bots */}
              <div aria-hidden className="hidden">
                <label>
                  Company
                  <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-urgent px-7 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {status === "submitting" ? "Adding you…" : "Join the waitlist"}
              </button>

              {status === "error" ? (
                <p className="text-sm text-urgent">{error}</p>
              ) : null}
              <p className="text-xs text-muted/60">
                One email when pilot access opens. No list sharing.
              </p>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

function Field({
  name,
  label,
  ...props
}: {
  name: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={`wl-${name}`}
        className="label mb-1.5 block text-muted"
      >
        {label}
      </label>
      <input
        id={`wl-${name}`}
        name={name}
        className="h-11 w-full rounded-lg border border-border bg-bg px-3 text-sm text-text outline-none placeholder:text-muted/40 focus:border-urgent"
        {...props}
      />
    </div>
  );
}

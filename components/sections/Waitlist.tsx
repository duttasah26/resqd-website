"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Section } from "@/components/ui/Section";
import { footer, waitlist } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = "email" | "organization" | "role";
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ["email", "organization", "role"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Record<FieldName, string>): Errors {
  const errors: Errors = {};
  if (!values.email) errors.email = "Enter your work email.";
  else if (!EMAIL.test(values.email))
    errors.email = "Enter an email like name@municipality.ca.";
  if (!values.organization) errors.organization = "Enter your organization.";
  if (!values.role) errors.role = "Choose the role closest to yours.";
  return errors;
}

function readForm(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    email: String(data.get("email") ?? "").trim(),
    organization: String(data.get("organization") ?? "").trim(),
    role: String(data.get("role") ?? "").trim(),
    company: String(data.get("company") ?? ""), // honeypot
  };
}

export function Waitlist() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  // Fields only show errors after the first submit attempt, then update live.
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move screen-reader and keyboard focus to the confirmation once it appears.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function revalidate() {
    if (!attempted || !formRef.current) return;
    setErrors(validate(readForm(formRef.current)));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const payload = readForm(form);
    const found = validate(payload);
    setAttempted(true);
    setErrors(found);

    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          body?.error ?? "Your details weren't saved. Try again in a moment.",
        );
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      // Keep what they typed; only the message changes.
      setError(
        err instanceof TypeError
          ? "Couldn't reach the server. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Your details weren't saved. Try again in a moment.",
      );
    }
  }

  return (
    <Section id="waitlist" className="py-24 sm:py-32 lg:py-40">
      <div className="rounded-lg border border-border bg-surface/60 p-5 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="font-display text-4xl font-bold leading-[1.03] tracking-tight text-text sm:text-5xl">
              {waitlist.heading}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              {waitlist.body}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              {waitlist.status}
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-lg border border-safe/40 bg-safe/10 p-6 sm:p-8">
              <h3
                ref={successRef}
                tabIndex={-1}
                className="font-display text-xl font-semibold text-text outline-none"
              >
                {waitlist.successTitle}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {waitlist.successBody}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Questions before then?{" "}
                <a
                  href={`mailto:${footer.email}`}
                  className="text-text underline underline-offset-4 hover:text-white"
                >
                  {footer.email}
                </a>
              </p>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={onSubmit}
              onChange={revalidate}
              className="space-y-5"
              noValidate
            >
              <Field
                name="email"
                type="email"
                inputMode="email"
                label="Work email"
                placeholder="you@municipality.ca"
                autoComplete="email"
                error={errors.email}
              />
              <Field
                name="organization"
                type="text"
                label="Organization"
                placeholder="e.g. Red Lake Fire Department"
                autoComplete="organization"
                error={errors.organization}
              />
              <FieldShell id="wl-role" label="Role" error={errors.role}>
                <select
                  id="wl-role"
                  name="role"
                  defaultValue=""
                  aria-invalid={errors.role ? true : undefined}
                  aria-describedby={errors.role ? "wl-role-error" : undefined}
                  className={inputClass(Boolean(errors.role))}
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
              </FieldShell>

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
                className="btn btn-primary btn-lg w-full sm:w-auto"
              >
                {status === "submitting" ? "Adding you…" : "Join the waitlist"}
              </button>

              {status === "error" ? (
                <p role="alert" className="text-sm text-urgent-text">
                  {error}
                </p>
              ) : null}
              <p className="text-[13px] text-muted">
                One email when pilot access opens. No list sharing.
              </p>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

// 16px text: iOS Safari zooms the page when a focused field is smaller.
function inputClass(invalid: boolean) {
  return `h-12 w-full rounded border bg-bg px-3 text-base text-text outline-none placeholder:text-[#8a8a93] focus-visible:border-text ${
    invalid ? "border-urgent-text" : "border-line-strong"
  }`;
}

function FieldShell({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-muted"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-urgent-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  name,
  label,
  error,
  ...props
}: {
  name: FieldName;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = `wl-${name}`;
  return (
    <FieldShell id={id} label={label} error={error}>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass(Boolean(error))}
        {...props}
      />
    </FieldShell>
  );
}

import { type ReactNode } from "react";

export function AnimFrame({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
      {label ? (
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-urgent" />
          <span className="label text-muted">{label}</span>
        </div>
      ) : null}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

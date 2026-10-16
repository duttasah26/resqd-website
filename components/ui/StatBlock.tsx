interface StatBlockProps {
  value: string;
  unit: string;
  label: string;
  source: string;
}

export function StatBlock({ value, unit, label, source }: StatBlockProps) {
  return (
    <div className="border-t border-border pt-6">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-display text-3xl font-bold text-text sm:text-5xl">
          {value}
        </span>
        <span className="font-mono text-sm uppercase tracking-widest text-urgent-text">
          {unit}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{label}</p>
      <p className="mt-3 font-mono text-[13px] text-muted">{source}</p>
    </div>
  );
}

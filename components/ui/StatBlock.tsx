interface StatBlockProps {
  value: string;
  unit: string;
  label: string;
  source: string;
}

export function StatBlock({ value, unit, label, source }: StatBlockProps) {
  return (
    <div className="border-t border-border pt-6">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-5xl font-bold text-text sm:text-6xl">
          {value}
        </span>
        <span className="font-mono text-sm uppercase tracking-widest text-urgent">
          {unit}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{label}</p>
      <p className="mt-3 font-mono text-xs text-muted/60">{source}</p>
    </div>
  );
}

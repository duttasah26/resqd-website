import { type ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

/** Full-width section with a centred, padded content column. */
export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`w-full px-5 sm:px-8 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

interface HeadingProps {
  kicker?: string;
  title: string;
  sub?: string;
  className?: string;
}

export function SectionHeading({ kicker, title, sub, className = "" }: HeadingProps) {
  return (
    <div className={`max-w-4xl ${className}`}>
      {kicker ? <p className="label mb-5 text-urgent">{kicker}</p> : null}
      <h2 className="font-display text-[2.5rem] font-bold leading-[1.0] tracking-tight text-text sm:text-6xl md:text-[4.5rem]">
        {title}
      </h2>
      {sub ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

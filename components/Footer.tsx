import Image from "next/image";
import { footer, nav, references, site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-14 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-mark-red.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span className="font-display text-base font-bold text-text">
              {site.name}
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            {footer.tagline}
          </p>
          <a
            href={`mailto:${footer.email}`}
            className="mt-4 inline-block text-sm text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
          >
            {footer.email}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted/60">
              On this page
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#waitlist"
                  className="text-muted transition-colors hover:text-text"
                >
                  Join the waitlist
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted/60">
              Sources
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              {references.map((ref) => (
                <li key={ref.href}>
                  <a
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted/70 underline-offset-2 transition-colors hover:text-text hover:underline"
                  >
                    {ref.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl border-t border-border pt-6">
        <p className="label !tracking-[0.1em] text-muted/50">
          © {new Date().getFullYear()} {site.name}. Work in progress, not yet
          operational.
        </p>
      </div>
    </footer>
  );
}

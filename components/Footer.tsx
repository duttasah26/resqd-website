import Image from "next/image";
import { footer, references, site } from "@/lib/content";

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
            className="-ml-1 mt-2 inline-block px-1 py-2 text-sm text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
          >
            {footer.email}
          </a>
        </div>

        <div>
          <p className="text-[13px] font-medium text-text">Sources</p>
          <ul className="mt-2 space-y-1 text-[13px] leading-snug">
            {references.map((ref) => (
              <li key={ref.href}>
                <a
                  href={ref.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1.5 text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
                >
                  {ref.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl border-t border-border pt-6">
        <p className="text-[13px] text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}

"use client"; // Error boundaries must be Client Components

import "./globals.css";

/*
  Last-resort page for an error in the root layout itself. It replaces the
  layout, so it brings its own document and stylesheet, and stays dependency
  free: system fonts, no images, nothing that could be what failed.
*/
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text">
        <title>Something went wrong · ResQd</title>
        <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-5 sm:px-8">
          <p className="readout !text-[13px] text-muted">
            Error{error.digest ? ` · ${error.digest}` : ""}
          </p>
          <h1 className="mt-3 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
            ResQd didn&apos;t load.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Something broke before the page could start. Try again in a moment.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => retry()} className="btn btn-primary btn-lg">
              Try again
            </button>
            {/* a full page load on purpose: the client router may be what failed */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="btn btn-secondary btn-lg">
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}

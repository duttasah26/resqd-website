"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { StatusPage } from "@/components/ui/StatusPage";
import { footer } from "@/lib/content";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="Error"
      title="This page didn't load."
      body={
        <>
          Try again. If it keeps happening, email{" "}
          <a
            href={`mailto:${footer.email}`}
            className="text-text underline underline-offset-4 hover:text-white"
          >
            {footer.email}
          </a>
          .
        </>
      }
    >
      <button type="button" onClick={() => retry()} className="btn btn-primary btn-lg">
        Try again
      </button>
      <Link href="/" className="btn btn-secondary btn-lg">
        Back to home
      </Link>
    </StatusPage>
  );
}

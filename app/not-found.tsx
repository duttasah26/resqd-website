import type { Metadata } from "next";
import Link from "next/link";
import { StatusPage } from "@/components/ui/StatusPage";

export const metadata: Metadata = {
  title: "Page not found · ResQd",
};

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Off the map."
      body="There's no page at this address. The link may be wrong, or the page may have moved."
    >
      <Link href="/" className="btn btn-primary btn-lg">
        Back to home
      </Link>
      <Link href="/#how-it-works" className="btn btn-secondary btn-lg">
        See how it works
      </Link>
    </StatusPage>
  );
}

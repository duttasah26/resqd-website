import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/Preloader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = "https://resqd.vercel.app";
const title = "ResQd: wildfire response that keeps up with the fire";
const description =
  "ResQd pulls field sensors, citizen reports, and evacuation routing onto one live map so dispatchers can move people before the fire reaches the road.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description:
      "One live map for the sensors, the reports, and the people on the ground. Join the waitlist for pilot access.",
    url: siteUrl,
    siteName: "ResQd",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "One live map for the sensors, the reports, and the people on the ground.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Preloader />
        <div aria-hidden className="page-aura" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/*
          App Router root layout is the correct place for this link, and `block`
          is deliberate for an icon font (avoids a flash of raw ligature text).
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
        {children}
      </body>
    </html>
  );
}

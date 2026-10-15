import type { Metadata, Viewport } from "next";
import { Inter, Archivo, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display face: Archivo, a grotesque with a squarer, more industrial build than
// Inter, giving headings an authoritative, dispatch-console voice.
const archivo = Archivo({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["600", "700"], // only the weights the headings use
  display: "swap",
});

// Operational mono: Roboto Mono, the same control-room readout face Watch Duty
// uses, for timestamps, coordinates, and status chrome.
const robotoMono = Roboto_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400"], // readouts are regular weight only
  display: "swap",
});

const siteUrl = "https://resqd.vercel.app";
const title = "ResQd: wildfire response that keeps up with the fire";
const description =
  "ResQd pulls field sensors, citizen reports, and evacuation routing onto one live map so dispatchers can move people before the fire reaches the road.";

// Draw edge to edge on notched phones (the mobile action bar pads itself with
// the safe-area inset) and tint the browser chrome to match the page.
export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  viewportFit: "cover",
};

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
      className={`${inter.variable} ${archivo.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <div aria-hidden className="page-aura" />
        {children}
      </body>
    </html>
  );
}

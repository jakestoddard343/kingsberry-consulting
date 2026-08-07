import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { site } from "@/lib/content";
import SmoothScroll from "@/components/SmoothScroll";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kingsberryconsulting.com"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
  keywords: [
    "AI lead generation",
    "marketing automation",
    "Salesforce consulting",
    "HubSpot implementation",
    "CRM optimization",
    "revenue operations",
    "B2B manufacturing marketing",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.positioning,
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.positioning,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04060d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="grain antialiased">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#04060d]"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

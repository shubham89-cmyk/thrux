import type { Metadata, Viewport } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Experience } from "@/components/experience";
import { site, siteUrl } from "@/lib/site";
import "@fontsource-variable/manrope";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: "THRUX - Brands that break through.", template: "%s - THRUX Media Studios" },
  description: site.description,
  openGraph: { type: "website", siteName: site.fullName, locale: "en_IN", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "THRUX. Brands that break through." }] },
  twitter: { card: "summary_large_image" },
  robots: { index: site.ready, follow: site.ready },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#07070b" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Experience /><a href="#main-content" className="skip-link">Skip to content</a><Header /><main id="main-content">{children}</main><Footer /></body></html>;
}

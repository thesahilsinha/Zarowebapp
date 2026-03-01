import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zarobakehouse.com"),
  title: {
    default: "Zaro Bakehouse - Fresh Baked Goods in Bandra, Mumbai",
    template: "%s | Zaro Bakehouse",
  },
  description:
    "Artisan breads, desserts, hampers and freshly baked goods delivered in Bandra, Mumbai. Order online from Zaro Bakehouse.",
  keywords: [
    "bakery bandra", "fresh bread mumbai", "desserts bandra west",
    "artisan bakery mumbai", "hampers mumbai", "zaro bakehouse",
    "cake delivery bandra", "freshly baked bandra", "online bakery mumbai",
  ],
  authors: [{ name: "Zaro Bakehouse" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://zarobakehouse.com",
    siteName: "Zaro Bakehouse",
    title: "Zaro Bakehouse - Fresh Baked Goods in Bandra, Mumbai",
    description: "Artisan breads, desserts, hampers and freshly baked goods delivered in Bandra, Mumbai.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-background text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
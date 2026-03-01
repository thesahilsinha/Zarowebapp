import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Zaro Bakehouse - Fresh Baked Goods in Bandra, Mumbai",
    template: "%s | Zaro Bakehouse",
  },
  description:
    "Artisan breads, desserts, hampers and freshly baked goods delivered in Bandra, Mumbai. Order online from Zaro Bakehouse.",
  keywords: [
    "bakery bandra", "fresh bread mumbai", "desserts bandra west",
    "artisan bakery mumbai", "hampers mumbai", "zaro bakehouse",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://zarobakehouse.com",
    siteName: "Zaro Bakehouse",
    title: "Zaro Bakehouse - Fresh Baked Goods in Bandra, Mumbai",
    description: "Artisan breads, desserts, hampers and freshly baked goods delivered in Bandra, Mumbai.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1a1a1a",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 20px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
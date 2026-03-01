import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="font-playfair text-9xl font-bold text-brand-100 mb-4">404</div>
          <h1 className="font-playfair text-3xl font-bold text-foreground mb-3">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-brand-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/shop"
              className="border border-border px-6 py-3 rounded-xl font-medium hover:bg-accent transition-colors"
            >
              Shop All
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// ```
// 
// ---
// 
// ## New files created this chunk:
// ```
// src/app/shop/page.tsx
// src/app/categories/[slug]/page.tsx
// src/app/products/[slug]/page.tsx
// src/app/not-found.tsx
// src/components/shop/ShopClient.tsx
// src/components/shop/ProductDetail.tsx
import ProductCard from "@/components/home/ProductCard";
import Link from "next/link";
import type { Product } from "@/types";

export default function BestSellersSection({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-1">Most Loved</p>
            <h2 className="font-playfair text-3xl font-bold text-foreground">Our Bestsellers</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-4">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface ProductRowProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  badge?: string;
}

export default function ProductRow({
  title,
  subtitle,
  products,
  viewAllHref,
  badge,
}: ProductRowProps) {
  if (!products.length) return null;

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {badge && (
              <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-2 tracking-wide">
                {badge}
              </span>
            )}
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground mt-1.5 text-sm">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors group"
            >
              View all
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile view all */}
        {viewAllHref && (
          <div className="mt-6 text-center sm:hidden">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 border border-brand-300 text-brand-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-50 transition-colors"
            >
              View all {title}
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
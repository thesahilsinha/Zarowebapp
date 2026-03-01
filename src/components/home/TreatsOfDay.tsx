"use client";
import { Clock } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

export default function TreatsOfDay({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-amber-50 via-cream-100 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <Clock size={14} />
            Limited Daily Selection
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
            Treats of the Day
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Hand-picked by our bakers every morning. Order before 2 PM for same-day delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
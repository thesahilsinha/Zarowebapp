"use client";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/types";

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -250 : 250, behavior: "smooth" });
    }
  };

  if (!categories.length) return null;

  return (
    <section className="bg-cream-200 border-b border-border">
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-soft hover:shadow-card transition-all hover:scale-105"
        >
          <ChevronLeft size={15} className="text-foreground" />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex items-start gap-0 overflow-x-auto scrollbar-hide px-12 py-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="flex flex-col items-center gap-3 flex-shrink-0 group px-5"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Circle */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white shadow-sm group-hover:shadow-card transition-all duration-300 ring-2 ring-transparent group-hover:ring-brand-500 ring-offset-2 ring-offset-cream-200">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-100 via-cream-300 to-cream-400 flex items-center justify-center">
                    <span className="text-2xl font-playfair font-bold text-brand-400">
                      {cat.name[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Label */}
              <span className="text-xs font-medium text-foreground text-center leading-tight w-20 group-hover:text-brand-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-soft hover:shadow-card transition-all hover:scale-105"
        >
          <ChevronRight size={15} className="text-foreground" />
        </button>
      </div>

      {/* Divider line like BSS */}
      <div className="border-t border-border/60 mx-6" />
    </section>
  );
}
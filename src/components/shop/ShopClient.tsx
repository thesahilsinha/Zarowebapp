"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/home/ProductCard";
import type { Product, Category } from "@/types";

interface Props {
  initialProducts: Product[];
  categories: Category[];
  searchParams: { [key: string]: string | undefined };
}

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Best Sellers", value: "best_sellers" },
];

const PER_PAGE = 20;

export default function ShopClient({ initialProducts, categories, searchParams }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.category || "all"
  );
  const [selectedType, setSelectedType] = useState<string>(
    searchParams.type || "all"
  );
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }
    if (selectedType !== "all") {
      result = result.filter((p) => p.type === selectedType);
    }
    if (searchParams.filter === "best_sellers") {
      result = result.filter((p) => p.is_best_seller);
    }

    result = result.filter((p) => {
      const price = p.discount_price || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case "price_desc":
        result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "best_sellers":
        result.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [initialProducts, selectedCategory, selectedType, sortBy, priceRange, searchParams.filter]);

  // Reset to page 1 whenever any filter/sort changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedType, sortBy, priceRange, searchParams.filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce((acc: (number | string)[], n, idx, arr) => {
      if (idx > 0 && (n as number) - (arr[idx - 1] as number) > 1) acc.push("...");
      acc.push(n);
      return acc;
    }, []);

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedType !== "all",
    priceRange[0] > 0 || priceRange[1] < 5000,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedType("all");
    setPriceRange([0, 5000]);
    setSortBy("newest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-brand-500 text-sm font-medium tracking-widest uppercase mb-1">
          {searchParams.filter === "best_sellers" ? "Customer Favourites" : "Everything we bake"}
        </p>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
          {searchParams.filter === "best_sellers"
            ? "Best Sellers"
            : searchParams.type === "freshly_bakes"
            ? "Freshly Baked"
            : "Shop All"}
        </h1>
        <p className="text-muted-foreground mt-2">{filtered.length} products</p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-brand-500 text-white"
              : "bg-white border border-border text-muted-foreground hover:border-brand-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.slug
                ? "bg-brand-500 text-white"
                : "bg-white border border-border text-muted-foreground hover:border-brand-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFiltersCount > 0
                ? "bg-brand-500 text-white border-brand-500"
                : "bg-white border-border hover:border-brand-300"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-white text-brand-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Type filter */}
          <div className="hidden sm:flex gap-2">
            {[
              { label: "All Types", value: "all" },
              { label: "Freshly Baked", value: "freshly_bakes" },
              { label: "Regular", value: "regular" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedType === t.value
                    ? "bg-foreground text-white"
                    : "bg-white border border-border hover:border-gray-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} />
              Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm font-medium hover:border-brand-300 transition-colors"
          >
            {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
            <ChevronDown size={14} />
          </button>
          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-card border border-border z-20 w-48 overflow-hidden"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      sortBy === opt.value
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "hover:bg-accent"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white rounded-2xl border border-border p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Type filter mobile */}
              <div className="sm:hidden">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Type
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "All Types", value: "all" },
                    { label: "Freshly Baked", value: "freshly_bakes" },
                    { label: "Regular", value: "regular" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setSelectedType(t.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium text-left transition-all ${
                        selectedType === t.value
                          ? "bg-foreground text-white"
                          : "bg-accent hover:bg-muted"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Price Range
                </p>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={50}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Category
                </p>
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === "all"
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "hover:bg-accent"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.slug
                          ? "bg-brand-50 text-brand-700 font-medium"
                          : "hover:bg-accent"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-playfair text-xl font-bold mb-2">No products found</h3>
          <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters</p>
          <button
            onClick={clearFilters}
            className="bg-brand-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
              <p className="text-xs text-muted-foreground order-2 sm:order-1">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {pageNumbers.map((n, i) =>
                  n === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => {
                        setPage(n as number);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                        page === n
                          ? "bg-brand-500 text-white"
                          : "border border-border hover:bg-accent"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
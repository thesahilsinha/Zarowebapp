"use client";
import { useState } from "react";
import { ShoppingBag, MessageCircle, ChevronRight, Zap, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";

const CATEGORIES = ["all", "birthday", "wedding", "special", "regular", "custom"];

export default function CakesClient({ cakes }: { cakes: any[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFlavours, setSelectedFlavours] = useState<Record<string, string>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = cakes.filter((c) =>
    activeCategory === "all" || c.category === activeCategory
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const buildWhatsAppMsg = (cake: any) => {
    const flavour = selectedFlavours[cake.id] || "Not specified";
    const size = selectedSizes[cake.id]?.label || "Not specified";
    const price = selectedSizes[cake.id]?.price || cake.price || "";
    return encodeURIComponent(
      `Hi Zaro Bakehouse! I'd like to pre-order a cake.\n\n` +
      `Cake: ${cake.name}\n` +
      `Flavour: ${flavour}\n` +
      `Size: ${size}${price ? ` — ₹${price}` : ""}\n` +
      `\nPlease confirm availability and delivery date. I need at least ${cake.preorder_days || 2} days advance notice.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-2">Baked to Order</p>
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-3">Our Cakes</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">From ready-to-pick-up classics to fully custom pre-order creations — every cake is made with love.</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => { setActiveCategory(cat); setPage(1); }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize flex-shrink-0 transition-colors ${
              activeCategory === cat ? "bg-forest-800 text-white" : "bg-white border border-border hover:bg-accent"
            }`}>
            {cat === "all" ? "All Cakes" : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {paginated.map((cake) => (
          <div key={cake.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300">
            {/* Image */}
            <div className="aspect-square bg-cream-200 overflow-hidden relative">
              {cake.images?.[0]
                ? <img src={cake.images[0]} alt={cake.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                : <div className="w-full h-full bg-gradient-to-br from-brand-100 to-cream-300 flex items-center justify-center">
                    <span className="font-playfair text-3xl text-brand-300">{cake.name[0]}</span>
                  </div>
              }
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                {cake.is_preorder
                  ? <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Zap size={9} /> Pre-order</span>
                  : <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><ShoppingBag size={9} /> Ready</span>
                }
                {cake.is_best_seller && (
                  <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Bestseller</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-playfair font-bold text-base mb-1">{cake.name}</h3>
              {cake.description && <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">{cake.description}</p>}

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex items-center gap-0.5 bg-forest-800 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                  <Star size={9} className="fill-white" /> {cake.rating}
                </div>
              </div>

              {/* Size selector */}
              {cake.sizes?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cake.sizes.map((size: any) => (
                      <button key={size.label}
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [cake.id]: size }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          selectedSizes[cake.id]?.label === size.label
                            ? "bg-forest-800 text-white"
                            : "bg-accent hover:bg-forest-100 text-foreground"
                        }`}>
                        {size.label} — ₹{size.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flavour selector */}
              {cake.flavours?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Flavour</p>
                  <select
                    value={selectedFlavours[cake.id] || ""}
                    onChange={(e) => setSelectedFlavours((prev) => ({ ...prev, [cake.id]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none bg-white">
                    <option value="">Select flavour</option>
                    {cake.flavours.map((f: string) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price */}
              <p className="font-bold text-lg mb-3">
                {selectedSizes[cake.id]?.price
                  ? `₹${selectedSizes[cake.id].price}`
                  : cake.sizes?.length
                    ? `From ₹${Math.min(...cake.sizes.map((s: any) => parseFloat(s.price) || 0))}`
                    : cake.price ? `₹${cake.price}` : "Price on request"
                }
              </p>

              {/* CTA */}
              {cake.is_preorder ? (
                <a href={`https://wa.me/919820153592?text=${buildWhatsAppMsg(cake)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  <MessageCircle size={15} /> Pre-order via WhatsApp
                </a>
              ) : (
                <button
                  onClick={() => toast.success(`${cake.name} added to cart!`)}
                  className="w-full bg-forest-800 hover:bg-forest-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  <ShoppingBag size={15} /> Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-accent disabled:opacity-40 transition-colors">
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${page === p ? "bg-brand-500 text-white" : "border border-border hover:bg-accent"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-accent disabled:opacity-40 transition-colors">
            Next
          </button>
        </div>
      )}

      {/* Pre-order info */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <h3 className="font-playfair font-bold text-xl mb-2">Custom Cake Orders</h3>
        <p className="text-muted-foreground text-sm mb-4">Want something completely custom? We do wedding cakes, corporate cakes, and fully personalized creations.</p>
        <a href={`https://wa.me/919820153592?text=${encodeURIComponent("Hi Zaro! I'd like to order a custom cake. Can you help me?")}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
          <MessageCircle size={16} /> Talk to Us on WhatsApp <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
}
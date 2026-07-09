"use client";
import { useState } from "react";
import { Plus, Minus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CustomHamperClient({ products }: { products: any[] }) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const addItem = (id: string) => setSelected((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeItem = (id: string) => setSelected((prev) => {
    const next = { ...prev };
    if (next[id] <= 1) delete next[id]; else next[id]--;
    return next;
  });
  const deleteItem = (id: string) => setSelected((prev) => { const next = { ...prev }; delete next[id]; return next; });

  const hamperItems = Object.entries(selected).map(([id, qty]) => {
    const product = products.find((p) => p.id === id)!;
    return { ...product, qty };
  });

  const total = hamperItems.reduce((sum, item) => sum + (item.discount_price || item.price) * item.qty, 0);

  const buildWhatsAppMessage = () => {
    const itemsList = hamperItems.map((i) =>
      `• ${i.name} x${i.qty} — ₹${((i.discount_price || i.price) * i.qty).toLocaleString("en-IN")}`
    ).join("\n");
    return encodeURIComponent(
      `Hi Zaro Bakehouse! I'd like to create a custom hamper:\n\n${itemsList}\n\nEstimated Total: ₹${total.toLocaleString("en-IN")}\n\nPlease confirm availability and packaging options.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-2">Make it yours</p>
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-3">Build Your Custom Hamper</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Pick any items from our menu and we'll pack them beautifully into a custom hamper for you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products */}
        <div className="lg:col-span-2">
          <input type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white mb-5" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {paginated.map((product) => {
              const qty = selected[product.id] || 0;
              const price = product.discount_price || product.price;
              return (
                <div key={product.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${qty > 0 ? "border-brand-400 shadow-card" : "border-border"}`}>
                  <div className="aspect-square bg-cream-200 overflow-hidden relative">
                    {product.images?.[0]
                      ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-brand-100 to-cream-300 flex items-center justify-center">
                          <span className="font-playfair text-2xl text-brand-300">{product.name[0]}</span>
                        </div>
                    }
                    {qty > 0 && (
                      <div className="absolute top-2 right-2 bg-brand-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{qty}</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-xs text-foreground line-clamp-2 mb-1">{product.name}</p>
                    <p className="font-bold text-sm text-foreground mb-2">₹{price}</p>
                    {qty === 0 ? (
                      <button onClick={() => addItem(product.id)}
                        className="w-full bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Plus size={12} /> Add
                      </button>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button onClick={() => removeItem(product.id)} className="w-8 h-8 rounded-lg bg-accent hover:bg-brand-100 flex items-center justify-center">
                          <Minus size={13} />
                        </button>
                        <span className="font-bold text-sm">{qty}</span>
                        <button onClick={() => addItem(product.id)} className="w-8 h-8 rounded-lg bg-forest-800 hover:bg-forest-700 text-white flex items-center justify-center">
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
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
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-border p-6 sticky top-24">
            <h2 className="font-playfair font-bold text-xl mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-brand-500" /> Your Hamper
            </h2>

            {hamperItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground text-sm">No items added yet.</p>
                <p className="text-muted-foreground text-xs mt-1">Pick items from the left.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
                  {hamperItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cream-200 overflow-hidden flex-shrink-0">
                        {item.images?.[0] && <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.qty} · ₹{((item.discount_price || item.price) * item.qty).toLocaleString("en-IN")}</p>
                      </div>
                      <button onClick={() => deleteItem(item.id)} className="p-1 hover:text-red-500 transition-colors text-muted-foreground">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-5">
                  <div className="flex justify-between text-sm font-bold text-foreground">
                    <span>Estimated Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Final price confirmed via WhatsApp.</p>
                </div>

                <a href={`https://wa.me/919820153592?text=${buildWhatsAppMessage()}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  <MessageCircle size={16} /> Send via WhatsApp
                </a>
                <p className="text-xs text-muted-foreground text-center mt-2">We'll confirm and arrange delivery.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
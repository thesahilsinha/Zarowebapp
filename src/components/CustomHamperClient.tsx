"use client";
import { useState } from "react";
import { Plus, Minus, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function CustomHamperClient({ products }: { products: any[] }) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addItem = (id: string) => setSelected((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeItem = (id: string) => setSelected((prev) => {
    const next = { ...prev };
    if (next[id] <= 1) delete next[id];
    else next[id]--;
    return next;
  });
  const deleteItem = (id: string) => setSelected((prev) => {
    const next = { ...prev }; delete next[id]; return next;
  });

  const hamperItems = Object.entries(selected).map(([id, qty]) => {
    const product = products.find((p) => p.id === id)!;
    return { ...product, qty };
  });

  const total = hamperItems.reduce((sum, item) => sum + (item.discount_price || item.price) * item.qty, 0);

  const handleAddToCart = async () => {
    if (hamperItems.length === 0) { toast.error("Add at least one item to your hamper"); return; }
    setAdding(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please login to continue"); router.push("/login"); setAdding(false); return; }

    for (const item of hamperItems) {
      await supabase.from("carts").upsert(
        { user_id: user.id, product_id: item.id, quantity: item.qty },
        { onConflict: "user_id,product_id" }
      );
    }

    toast.success("Hamper added to cart!");
    setAdding(false);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-2">Make it yours</p>
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-3">Build Your Custom Hamper</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">Pick any items from our menu and we'll pack them beautifully into a custom hamper. Checkout normally and add special packaging instructions in the order notes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product selector */}
        <div className="lg:col-span-2">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white mb-5" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((product) => {
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
                        <button onClick={() => removeItem(product.id)} className="w-8 h-8 rounded-lg bg-accent hover:bg-brand-100 flex items-center justify-center transition-colors">
                          <Minus size={13} />
                        </button>
                        <span className="font-bold text-sm">{qty}</span>
                        <button onClick={() => addItem(product.id)} className="w-8 h-8 rounded-lg bg-forest-800 hover:bg-forest-700 text-white flex items-center justify-center transition-colors">
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hamper summary */}
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
                      <button onClick={() => deleteItem(item.id)} className="p-1 hover:text-red-500 transition-colors text-muted-foreground flex-shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-5">
                  <div className="flex justify-between text-sm font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Packaging included. Add instructions at checkout.</p>
                </div>

                <button onClick={handleAddToCart} disabled={adding}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {adding
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
                    : <><ShoppingBag size={16} /> Proceed to Checkout <ChevronRight size={15} /></>
                  }
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
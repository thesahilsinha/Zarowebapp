"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

const FREE_DELIVERY_THRESHOLD = 499;

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, updateItem, removeItem, subtotal, loading } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (cartOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-500" />
                <h2 className="font-playfair font-bold text-xl">Your Cart</h2>
                {items.length > 0 && (
                  <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-xl hover:bg-accent flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free delivery progress */}
            {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
              <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
                <p className="text-xs text-amber-700 mb-1.5">
                  Add <span className="font-bold">{formatPrice(remaining)}</span> more for free delivery in Bandra
                </p>
                <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal >= FREE_DELIVERY_THRESHOLD && (
              <div className="px-5 py-2.5 bg-green-50 border-b border-green-100">
                <p className="text-xs text-green-700 font-medium">
                  You have free delivery in Bandra
                </p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {loading ? (
                <div className="space-y-4 px-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-18 h-18 bg-accent rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-accent rounded w-3/4" />
                        <div className="h-3 bg-accent rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="font-playfair font-bold text-xl mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Add some delicious bakes to get started
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="bg-brand-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="px-5 space-y-4">
                  {items.map((item) => {
                    const price = item.product.discount_price || item.product.price;
                    return (
                      <div key={item.id} className="flex gap-3">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="w-20 h-20 rounded-2xl overflow-hidden bg-cream-200 flex-shrink-0"
                        >
                          <img
                            src={item.product.images?.[0] || "/placeholder.jpg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="font-medium text-sm text-foreground hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
                          >
                            {item.product.name}
                          </Link>
                          <p className="font-bold text-sm mt-1">{formatPrice(price)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateItem(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Subtotal</span>
                  <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Delivery charges calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg"
                >
                  Proceed to Checkout
                  <ChevronRight size={18} />
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
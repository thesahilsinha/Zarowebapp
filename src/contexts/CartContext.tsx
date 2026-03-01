"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCart, updateCartQuantity, removeFromCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    const cart = await getCart();
    setItems(cart);
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) refreshCart();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") refreshCart();
      if (event === "SIGNED_OUT") setItems([]);
    });

    return () => subscription.unsubscribe();
  }, [refreshCart]);

  const addItem = async (productId: string, quantity: number = 1) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    const { error } = await addToCart(productId, quantity);
    if (error) {
      toast.error(error);
      return;
    }

    await refreshCart();
    setCartOpen(true);
    toast.success("Added to cart");
  };

  const updateItem = async (cartItemId: string, quantity: number) => {
    await updateCartQuantity(cartItemId, quantity);
    await refreshCart();
  };

  const removeItem = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    await refreshCart();
    toast.success("Removed from cart");
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items, loading, cartOpen, setCartOpen,
      addItem, updateItem, removeItem, refreshCart,
      totalItems, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
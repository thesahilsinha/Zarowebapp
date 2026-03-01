import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/types";

export async function getCart(): Promise<CartItem[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("carts")
    .select("*, product:products(*, category:categories(*))")
    .eq("user_id", user.id);

  return (data as CartItem[]) || [];
}

export async function addToCart(productId: string, quantity: number = 1) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please login to add items to cart" };

  // Check if already in cart
  const { data: existing } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("carts")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    return { error: error?.message };
  }

  const { error } = await supabase
    .from("carts")
    .insert({ user_id: user.id, product_id: productId, quantity });

  return { error: error?.message };
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = createClient();
  if (quantity < 1) {
    await supabase.from("carts").delete().eq("id", cartItemId);
    return;
  }
  await supabase.from("carts").update({ quantity }).eq("id", cartItemId);
}

export async function removeFromCart(cartItemId: string) {
  const supabase = createClient();
  await supabase.from("carts").delete().eq("id", cartItemId);
}

export async function clearCart(userId: string) {
  const supabase = createClient();
  await supabase.from("carts").delete().eq("user_id", userId);
}

export function calculateCartTotals(items: CartItem[], deliveryCharge: number = 0, discount: number = 0) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal + deliveryCharge - discount;
  return { subtotal, deliveryCharge, discount, total };
}
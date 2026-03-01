"use client";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function WishlistTab({ wishlist }: { wishlist: any[] }) {
  const { addItem } = useCart();
  const router = useRouter();

  const removeFromWishlist = async (wishlistId: string) => {
    const supabase = createClient();
    await supabase.from("wishlists").delete().eq("id", wishlistId);
    toast.success("Removed from wishlist");
    router.refresh();
  };

  if (!wishlist.length) {
    return (
      <div className="bg-white rounded-2xl border border-border p-10 text-center">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-playfair font-bold text-xl mb-2">Your wishlist is empty</h3>
        <p className="text-muted-foreground text-sm mb-6">Save items you love for later</p>
        <Link href="/shop" className="inline-block bg-brand-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-playfair font-bold text-2xl">My Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {wishlist.map((item) => {
          const product = item.product;
          if (!product) return null;
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-border overflow-hidden group">
              <Link href={`/products/${product.slug}`} className="block aspect-square bg-cream-200 overflow-hidden">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-3">
                <Link href={`/products/${product.slug}`}>
                  <p className="font-medium text-sm line-clamp-2 hover:text-brand-600 transition-colors mb-1">
                    {product.name}
                  </p>
                </Link>
                <p className="font-bold text-sm mb-2">
                  {formatPrice(product.discount_price || product.price)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => addItem(product.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    <ShoppingBag size={13} /> Add
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <Heart size={14} className="text-red-400 fill-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
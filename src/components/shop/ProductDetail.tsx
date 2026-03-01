"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ChevronRight,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { formatPrice, calculateDiscount, getDeliveryEstimate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Product } from "@/types";

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const images = product.images?.length > 0 ? product.images : ["/placeholder.jpg"];
  const discount = calculateDiscount(product.price, product.discount_price);
  const deliveryEstimate = getDeliveryEstimate(product.type, true);

  const handleAddToCart = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    setAddingToCart(true);
    try {
      const { error } = await supabase
        .from("carts")
        .upsert(
          { user_id: user.id, product_id: product.id, quantity },
          { onConflict: "user_id,product_id" }
        );

      if (error) throw error;
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login to save items");
      return;
    }

    if (isWishlisted) {
      await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);
      setIsWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      await supabase
        .from("wishlists")
        .insert({ user_id: user.id, product_id: product.id });
      setIsWishlisted(true);
      toast.success("Saved to wishlist");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-200">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={images[selectedImage]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.type === "freshly_bakes" && (
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Zap size={11} /> Freshly Baked
                </span>
              )}
              {product.is_best_seller && (
                <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Bestseller
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Share */}
            <button
              onClick={() => {
                navigator.share?.({ title: product.name, url: window.location.href });
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-soft"
            >
              <Share2 size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === i
                      ? "ring-2 ring-brand-500 ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-brand-500 text-sm font-medium hover:text-brand-600 transition-colors mb-2"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.rating_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-bold text-3xl text-foreground">
              {formatPrice(product.discount_price || product.price)}
            </span>
            {product.discount_price && (
              <span className="text-muted-foreground text-lg line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-green-600 text-sm font-semibold">
                You save {formatPrice(product.price - product.discount_price!)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
              {product.description}
            </p>
          )}

          {/* Delivery */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2.5">
              <Truck size={18} className="text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Estimated Delivery: {deliveryEstimate}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  {product.type === "freshly_bakes"
                    ? "Order before 2 PM for same-day delivery in Bandra"
                    : "Free delivery on orders above ₹499 in Bandra"}
                </p>
              </div>
            </div>
          </div>

          {/* Stock warning */}
          {product.stock <= 10 && product.stock > 0 && (
            <p className="text-orange-600 text-sm font-medium mb-4">
              Only {product.stock} left in stock
            </p>
          )}

          {product.stock === 0 && (
            <p className="text-red-600 text-sm font-medium mb-4">Out of stock</p>
          )}

          {/* Quantity + Actions */}
          <div className="flex items-center gap-3 mb-4">
            {/* Quantity */}
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
            >
              <ShoppingBag size={18} />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                isWishlisted
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "border-border hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Heart size={18} className={isWishlisted ? "fill-red-500" : ""} />
            </button>
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 border-2 border-brand-500 text-brand-600 font-semibold py-3 rounded-xl hover:bg-brand-50 transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
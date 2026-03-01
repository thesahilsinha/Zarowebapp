"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addItem } = useCart();

  const images = product.images?.length > 0 ? product.images : ["/placeholder.jpg"];
  const discount = calculateDiscount(product.price, product.discount_price);

  useEffect(() => {
    if (isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentImage(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovered, images.length]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    await addItem(product.id);
    setAdding(false);
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-border hover:border-brand-200 hover:shadow-card-hover transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-cream-200" style={{ aspectRatio: "1/1" }}>
        <img
          src={images[currentImage]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Image dots */}
        {images.length > 1 && isHovered && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-300 ${i === currentImage ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"}`} />
            ))}
          </div>
        )}

        {/* Badges top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.type === "freshly_bakes" && (
            <span className="bg-forest-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap size={9} /> Fresh
            </span>
          )}
          {discount > 0 && (
            <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:scale-110"
        >
          <Heart size={14} className={wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
        </button>

        {/* Add to cart — appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="w-full bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {adding ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><ShoppingBag size={13} /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}</>
            )}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm text-foreground leading-snug mb-1 line-clamp-2 hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <div>
            <span className="font-bold text-base text-foreground">
              {formatPrice(product.discount_price || product.price)}
            </span>
            {product.discount_price && (
              <span className="text-muted-foreground text-xs line-through ml-1.5">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-forest-800 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
              <Star size={9} className="fill-white" />
              {product.rating?.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
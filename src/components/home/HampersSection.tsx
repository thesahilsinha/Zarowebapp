import Link from "next/link";
import ProductCard from "@/components/home/ProductCard";
import type { Product } from "@/types";

const HAMPER_TYPES = [
  { label: "Bestselling Hampers", href: "/categories/our-hampers", bg: "#fce4ec", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=80" },
  { label: "Birthday Hampers", href: "/shop?search=birthday", bg: "#fff8e1", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
  { label: "Luxury Gift Boxes", href: "/shop?search=gift", bg: "#f3e5f5", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80" },
  { label: "Festive Specials", href: "/shop?search=festive", bg: "#e8f5e9", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=200&q=80" },
  { label: "Custom Gifting", href: "/dashboard/help", bg: "#e3f2fd", image: "https://images.unsplash.com/photo-1513201099705-a9746072f043?w=200&q=80" },
];

export default function HampersSection({ products }: { products: Product[] }) {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Say it with Zaro */}
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">Say it with Zaro</h2>
          <p className="text-muted-foreground text-sm">For every celebration, mood and person — we have something special.</p>
        </div>

        {/* Hamper type circles */}
        <div className="flex items-start justify-center gap-8 mb-14 overflow-x-auto scrollbar-hide pb-2">
          {HAMPER_TYPES.map((type) => (
            <Link key={type.label} href={type.href} className="flex flex-col items-center gap-3 flex-shrink-0 group">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-brand-500 ring-offset-2 transition-all duration-300 shadow-sm"
                style={{ background: type.bg }}>
                <img src={type.image} alt={type.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-xs font-semibold text-foreground text-center w-24 leading-tight group-hover:text-brand-600 transition-colors">{type.label}</span>
            </Link>
          ))}
        </div>

        {/* Products grid */}
        {products.length > 0 && (
          <>
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-playfair text-3xl font-bold text-foreground">Our Bestselling Hampers</h2>
              <Link href="/categories/our-hampers" className="text-sm font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-4">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
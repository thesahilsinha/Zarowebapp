import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import ProductDetail from "@/components/shop/ProductDetail";
import ProductRow from "@/components/home/ProductRow";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Zaro Bakehouse`,
    description: product.description || `Order ${product.name} from Zaro Bakehouse, freshly baked in Bandra, Mumbai.`,
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(5);

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [],
    description: product.description,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.discount_price || product.price,
      priceCurrency: "INR",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      ratingCount: product.rating_count,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TopBanner />
      <Header />
      <main>
        <ProductDetail product={product} />
        {related && related.length > 0 && (
          <div className="border-t border-border">
            <ProductRow
              title="You Might Also Like"
              products={related}
              viewAllHref={`/categories/${product.category?.slug}`}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import ShopClient from "@/components/shop/ShopClient";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Zaro Bakehouse`,
    description: `Shop ${category.name} from Zaro Bakehouse, Bandra Mumbai. Fresh and artisan baked goods delivered to your door.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const supabase = await createClient();

  const [{ data: category }, { data: categories }] = await Promise.all([
    supabase.from("categories").select("*").eq("slug", params.slug).single(),
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
  ]);

  if (!category) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        {/* Category Hero */}
        <div className="bg-gradient-to-br from-brand-50 to-cream-200 py-12 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            {category.image_url && (
              <img
                src={category.image_url}
                alt={category.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 shadow-soft"
              />
            )}
            <p className="text-brand-500 text-sm font-medium tracking-widest uppercase mb-2">
              Category
            </p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              {category.name}
            </h1>
          </div>
        </div>

        <ShopClient
          initialProducts={products || []}
          categories={categories || []}
          searchParams={{ ...searchParams, category: params.slug }}
        />
      </main>
      <Footer />
    </div>
  );
}
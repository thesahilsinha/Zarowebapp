import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import ShopClient from "@/components/shop/ShopClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse all freshly baked goods, desserts, hampers and more from Zaro Bakehouse, Bandra Mumbai.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <ShopClient
          initialProducts={products || []}
          categories={categories || []}
          searchParams={searchParams}
        />
      </main>
      <Footer />
    </div>
  );
}
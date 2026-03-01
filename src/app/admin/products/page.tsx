import { createClient } from "@/lib/supabase/server";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, category:categories(name)").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
  ]);
  return <AdminProductsClient products={products || []} categories={categories || []} />;
}
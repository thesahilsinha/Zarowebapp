import { createClient } from "@/lib/supabase/server";
import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("display_order");
  return <AdminCategoriesClient categories={categories || []} />;
}
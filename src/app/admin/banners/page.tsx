import { createClient } from "@/lib/supabase/server";
import AdminBannersClient from "@/components/admin/AdminBannersClient";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase.from("hero_banners").select("*").order("display_order");
  return <AdminBannersClient banners={banners || []} />;
}
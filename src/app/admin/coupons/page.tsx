import { createClient } from "@/lib/supabase/server";
import AdminCouponsClient from "@/components/admin/AdminCouponsClient";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  return <AdminCouponsClient coupons={coupons || []} />;
}
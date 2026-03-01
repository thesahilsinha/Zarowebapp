import { createClient } from "@/lib/supabase/server";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email, phone)")
    .order("created_at", { ascending: false });

  return <AdminOrdersClient orders={orders || []} />;
}
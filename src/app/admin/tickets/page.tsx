import { createClient } from "@/lib/supabase/server";
import AdminTicketsClient from "@/components/admin/AdminTicketsClient";

export default async function AdminTicketsPage() {
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from("help_tickets")
    .select("*, profiles(full_name, email), order:orders(order_number)")
    .order("created_at", { ascending: false });
  return <AdminTicketsClient tickets={tickets || []} />;
}
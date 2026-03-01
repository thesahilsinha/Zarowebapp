import { createClient } from "@/lib/supabase/server";
import AdminPincodesClient from "@/components/admin/AdminPincodesClient";

export default async function AdminPincodesPage() {
  const supabase = await createClient();
  const { data: pincodes } = await supabase.from("pincodes").select("*").order("pincode");
  return <AdminPincodesClient pincodes={pincodes || []} />;
}
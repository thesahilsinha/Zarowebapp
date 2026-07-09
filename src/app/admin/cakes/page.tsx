import { createClient } from "@supabase/supabase-js";
import AdminCakesClient from "@/components/admin/AdminCakesClient";

export default async function AdminCakesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: cakes } = await supabase
    .from("cakes")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminCakesClient cakes={cakes || []} />;
}
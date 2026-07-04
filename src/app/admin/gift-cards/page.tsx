import { createClient } from "@supabase/supabase-js";
import AdminGiftCardsClient from "@/components/admin/AdminGiftCardsClient";

export default async function AdminGiftCardsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: giftCards } = await supabase
    .from("gift_cards")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminGiftCardsClient giftCards={giftCards || []} />;
}
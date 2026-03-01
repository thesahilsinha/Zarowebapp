import { createClient } from "@/lib/supabase/server";
import AdminSettingsClient from "@/components/admin/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("settings").select("*");
  const settingsMap = Object.fromEntries((settings || []).map((s: any) => [s.key, s.value]));
  return <AdminSettingsClient settings={settingsMap} />;
}
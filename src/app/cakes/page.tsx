import { createClient } from "@/lib/supabase/server";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CakesClient from "@/components/CakesClient";

export const metadata = { title: "Cakes | Zaro Bakehouse" };

export default async function CakesPage() {
  const supabase = await createClient();
  const { data: cakes } = await supabase
    .from("cakes")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <CakesClient cakes={cakes || []} />
      </main>
      <Footer />
    </div>
  );
}
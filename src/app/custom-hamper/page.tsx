import { createClient } from "@/lib/supabase/server";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomHamperClient from "@/components/CustomHamperClient";

export const metadata = { title: "Build Your Hamper | Zaro Bakehouse" };

export default async function CustomHamperPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <CustomHamperClient products={products || []} />
      </main>
      <Footer />
    </div>
  );
}
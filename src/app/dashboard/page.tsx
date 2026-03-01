import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata = { title: "My Account | Zaro Bakehouse" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string; success?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: orders }, { data: wishlist }, { data: addresses }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("wishlists").select("*, product:products(*)").eq("user_id", user.id),
      supabase.from("addresses").select("*").eq("user_id", user.id),
    ]);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <DashboardClient
          profile={profile}
          orders={orders || []}
          wishlist={wishlist || []}
          addresses={addresses || []}
          activeTab={searchParams.tab || "orders"}
          successOrder={searchParams.success}
        />
      </main>
      <Footer />
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HelpDeskClient from "@/components/dashboard/HelpDeskClient";

export const metadata = { title: "Help Desk | Zaro Bakehouse" };

export default async function HelpDeskPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: tickets }, { data: orders }] = await Promise.all([
    supabase
      .from("help_tickets")
      .select("*, order:orders(order_number, total, status)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("id, order_number, total, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <HelpDeskClient
          tickets={tickets || []}
          orders={orders || []}
          userId={user.id}
        />
      </main>
      <Footer />
    </div>
  );
}
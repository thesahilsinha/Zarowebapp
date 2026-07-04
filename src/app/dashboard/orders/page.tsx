import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrdersTab from "@/components/dashboard/OrdersTab";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const successOrder = searchParams?.success;

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {successOrder && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-playfair font-bold text-xl text-green-800 mb-1">Order Placed Successfully!</h2>
              <p className="text-green-700 text-sm mb-1">Your order <strong>#{successOrder}</strong> has been received.</p>
              <p className="text-green-600 text-xs">We'll send you a confirmation email shortly. Track your order status below.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-playfair text-3xl font-bold">My Orders</h1>
          <Link href="/shop" className="text-sm font-semibold text-brand-600 hover:underline">
            Continue Shopping
          </Link>
        </div>

        <OrdersTab orders={orders || []} />
      </main>
      <Footer />
    </div>
  );
}
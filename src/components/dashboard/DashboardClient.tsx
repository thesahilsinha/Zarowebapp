"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Heart, User, MapPin, HelpCircle,
  LogOut, ChevronRight, Package, Clock, CheckCircle,
  XCircle, Truck
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";
import OrdersTab from "./OrdersTab";
import WishlistTab from "./WishlistTab";
import ProfileTab from "./ProfileTab";
import AddressesTab from "./AddressesTab";

const TABS = [
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "profile", label: "Profile", icon: User },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "help", label: "Help Desk", icon: HelpCircle },
];

export default function DashboardClient({
  profile, orders, wishlist, addresses, activeTab, successOrder
}: any) {
  const router = useRouter();
  const [tab, setTab] = useState(activeTab);

  const handleTabChange = (key: string) => {
    setTab(key);
    if (key === "help") { router.push("/dashboard/help"); return; }
    router.push(`/dashboard?tab=${key}`, { scroll: false });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Success banner */}
      {successOrder && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Order placed successfully!</p>
            <p className="text-green-700 text-xs">Order #{successOrder} is confirmed. We'll notify you on updates.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-3">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="font-playfair font-bold text-brand-600 text-lg">
                  {profile?.full_name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    tab === key
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {key === "orders" && orders.length > 0 && (
                    <span className="ml-auto bg-brand-100 text-brand-700 text-xs px-1.5 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="border-t border-border mt-3 pt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {tab === "orders" && <OrdersTab orders={orders} />}
          {tab === "wishlist" && <WishlistTab wishlist={wishlist} />}
          {tab === "profile" && <ProfileTab profile={profile} />}
          {tab === "addresses" && <AddressesTab addresses={addresses} userId={profile?.id} />}
        </div>
      </div>
    </div>
  );
}
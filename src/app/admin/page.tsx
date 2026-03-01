import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: totalUsers },
    { count: totalProducts },
    { data: recentOrders },
    { data: orderStats },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*, profiles(full_name, email)").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("total, status, created_at"),
  ]);

  const revenue = orderStats?.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0) || 0;
  const todayOrders = orderStats?.filter(o => {
    const today = new Date(); const d = new Date(o.created_at);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  }).length || 0;

  const stats = [
    { label: "Total Orders", value: totalOrders || 0, sub: `${todayOrders} today`, color: "bg-blue-50 text-blue-600" },
    { label: "Total Revenue", value: `₹${Math.round(revenue).toLocaleString("en-IN")}`, sub: "All time", color: "bg-green-50 text-green-600" },
    { label: "Total Users", value: totalUsers || 0, sub: "Registered", color: "bg-purple-50 text-purple-600" },
    { label: "Products", value: totalProducts || 0, sub: "Active listings", color: "bg-amber-50 text-amber-600" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    dispatched: "bg-purple-100 text-purple-700",
    out_for_delivery: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-border p-5">
            <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 ${stat.color}`}>
              {stat.sub}
            </div>
            <p className="font-playfair text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</a>
        </div>
        <div className="divide-y divide-border">
          {recentOrders?.map((order: any) => (
            <div key={order.id} className="px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">#{order.order_number}</p>
                <p className="text-xs text-muted-foreground">{order.profiles?.full_name || "Guest"} · {order.profiles?.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status.replace("_", " ")}
                </span>
                <span className="font-bold text-sm">₹{order.total}</span>
              </div>
            </div>
          ))}
          {!recentOrders?.length && (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
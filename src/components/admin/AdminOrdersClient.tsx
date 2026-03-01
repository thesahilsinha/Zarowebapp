"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const STATUSES = ["pending","confirmed","dispatched","out_for_delivery","delivered","cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  dispatched: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersClient({ orders }: { orders: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.order_number.includes(search) ||
      o.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    const supabase = createClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) toast.error("Failed to update status");
    else { toast.success("Status updated"); router.refresh(); }
    setUpdating(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="font-playfair text-3xl font-bold mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, name, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-sm">#{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.profiles?.full_name} · {order.profiles?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                  {order.status.replace("_", " ")}
                </span>
                <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expanded === order.id && (
              <div className="border-t border-border p-4 space-y-4">
                {/* Items */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Items</p>
                  <div className="space-y-2">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-10 h-10 rounded-lg bg-cream-200 overflow-hidden flex-shrink-0">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                        </div>
                        <span className="flex-1">{item.name} × {item.quantity}</span>
                        <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Delivery Address</p>
                  <p className="text-sm">{order.delivery_address?.full_name} · {order.delivery_address?.phone}</p>
                  <p className="text-sm text-muted-foreground">{order.delivery_address?.address_line1}, {order.delivery_address?.city} {order.delivery_address?.pincode}</p>
                </div>

                {/* Status update */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(order.id, s)}
                        disabled={order.status === s || updating === order.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          order.status === s
                            ? STATUS_COLORS[s] + " opacity-100 cursor-default"
                            : "bg-accent hover:bg-brand-100 text-foreground"
                        }`}
                      >
                        {updating === order.id ? "..." : s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {!filtered.length && (
          <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground text-sm">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}
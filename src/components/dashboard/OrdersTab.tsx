"use client";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:          { label: "Pending",          color: "bg-amber-100 text-amber-700" },
  confirmed:        { label: "Confirmed",         color: "bg-blue-100 text-blue-700" },
  dispatched:       { label: "Dispatched",        color: "bg-purple-100 text-purple-700" },
  out_for_delivery: { label: "Out for Delivery",  color: "bg-orange-100 text-orange-700" },
  delivered:        { label: "Delivered",         color: "bg-green-100 text-green-700" },
  cancelled:        { label: "Cancelled",         color: "bg-red-100 text-red-700" },
};

export default function OrdersTab({ orders }: { orders: any[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!orders.length) {
    return (
      <div className="bg-white rounded-2xl border border-border p-10 text-center">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-playfair font-bold text-xl mb-2">No orders yet</h3>
        <p className="text-muted-foreground text-sm mb-6">Your order history will appear here</p>
        <a href="/shop" className="inline-block bg-brand-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors">
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-playfair font-bold text-2xl">My Orders</h2>
      {orders.map((order) => {
        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
        const isExpanded = expanded === order.id;

        return (
          <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden">
            {/* Order header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setExpanded(isExpanded ? null : order.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package size={18} className="text-brand-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">#{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                  {status.label}
                </span>
                <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="border-t border-border p-4 space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-cream-200 overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-accent rounded-xl p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{order.delivery_charge === 0 ? "Free" : formatPrice(order.delivery_charge)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-1 border-t border-border">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Delivery address */}
                <div className="text-sm">
                  <p className="font-semibold mb-1">Delivery Address</p>
                  <p className="text-muted-foreground">
                    {order.delivery_address?.address_line1}, {order.delivery_address?.city} — {order.delivery_address?.pincode}
                  </p>
                </div>

                {/* Payment */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-medium capitalize">
                    {order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
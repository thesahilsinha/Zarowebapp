"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { HelpCircle, Plus, ChevronDown, ChevronUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { generateTicketNumber } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open:        { label: "Open",        color: "bg-red-100 text-red-700",    icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700", icon: Clock },
  resolved:    { label: "Resolved",    color: "bg-green-100 text-green-700", icon: CheckCircle },
};

export default function HelpDeskClient({ tickets, orders, userId }: any) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ order_id: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) { toast.error("Please fill subject and message"); return; }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("help_tickets").insert({
      ticket_number: generateTicketNumber(),
      user_id: userId,
      order_id: form.order_id || null,
      subject: form.subject,
      message: form.message,
      status: "open",
    });
    if (error) { toast.error("Failed to submit ticket"); setSubmitting(false); return; }
    toast.success("Ticket submitted! We'll get back to you soon.");
    setForm({ order_id: "", subject: "", message: "" });
    setShowForm(false);
    router.refresh();
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold">Help Desk</h1>
          <p className="text-muted-foreground text-sm mt-1">Raise a support ticket or track existing ones</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {/* New ticket form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <HelpCircle size={16} className="text-brand-500" /> New Support Ticket
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Related Order (Optional)
              </label>
              <select
                value={form.order_id}
                onChange={(e) => setForm({ ...form, order_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                <option value="">Select an order (optional)</option>
                {orders.map((order: any) => (
                  <option key={order.id} value={order.id}>
                    #{order.order_number} — ₹{order.total}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Wrong item delivered"
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets list */}
      {!tickets.length ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-playfair font-bold text-xl mb-2">No tickets yet</h3>
          <p className="text-muted-foreground text-sm">Need help? Create a support ticket above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket: any) => {
            const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
            const StatusIcon = status.icon;
            const isExpanded = expanded === ticket.id;

            return (
              <div key={ticket.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : ticket.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${status.color}`}>
                      <StatusIcon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        #{ticket.ticket_number} ·{" "}
                        {new Date(ticket.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                        {ticket.order && ` · Order #${ticket.order.order_number}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Your Message</p>
                      <p className="text-sm text-foreground leading-relaxed bg-accent rounded-xl p-3">{ticket.message}</p>
                    </div>
                    {ticket.admin_reply && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Response from Zaro</p>
                        <p className="text-sm text-foreground leading-relaxed bg-brand-50 border border-brand-100 rounded-xl p-3">{ticket.admin_reply}</p>
                      </div>
                    )}
                    {!ticket.admin_reply && ticket.status !== "resolved" && (
                      <p className="text-xs text-muted-foreground italic">Our team will respond shortly.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
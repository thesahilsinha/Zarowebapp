"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open:        { label: "Open",        color: "bg-red-100 text-red-700",    icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700", icon: Clock },
  resolved:    { label: "Resolved",    color: "bg-green-100 text-green-700", icon: CheckCircle },
};

export default function AdminTicketsClient({ tickets }: { tickets: any[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const updateTicket = async (id: string, status: string, reply?: string) => {
    setSaving(id);
    const supabase = createClient();
    const update: any = { status, updated_at: new Date().toISOString() };
    if (reply) update.admin_reply = reply;
    await supabase.from("help_tickets").update(update).eq("id", id);
    toast.success("Ticket updated!");
    router.refresh();
    setSaving(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold">Help Desk</h1>
        <div className="flex gap-2">
          {["all", "open", "in_progress", "resolved"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter === s ? "bg-brand-500 text-white" : "bg-white border border-border hover:bg-accent"}`}>
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((ticket) => {
          const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
          const StatusIcon = status.icon;
          const isExpanded = expanded === ticket.id;

          return (
            <div key={ticket.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : ticket.id)}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${status.color}`}>
                    <StatusIcon size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      #{ticket.ticket_number} · {ticket.profiles?.full_name} ({ticket.profiles?.email})
                      {ticket.order && ` · Order #${ticket.order.order_number}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ticket.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border p-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Customer Message</p>
                    <p className="text-sm bg-accent rounded-xl p-3 leading-relaxed">{ticket.message}</p>
                  </div>

                  {ticket.admin_reply && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Your Reply</p>
                      <p className="text-sm bg-brand-50 border border-brand-100 rounded-xl p-3 leading-relaxed">{ticket.admin_reply}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Reply to Customer</p>
                    <textarea
                      value={replies[ticket.id] || ""}
                      onChange={(e) => setReplies({ ...replies, [ticket.id]: e.target.value })}
                      placeholder="Type your response..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-2">Set Status:</p>
                    {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                      <button key={key}
                        onClick={() => updateTicket(ticket.id, key, replies[ticket.id])}
                        disabled={saving === ticket.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${ticket.status === key ? val.color : "bg-accent hover:bg-brand-50"}`}>
                        {saving === ticket.id ? "..." : val.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!filtered.length && (
          <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground text-sm">No tickets found</div>
        )}
      </div>
    </div>
  );
}
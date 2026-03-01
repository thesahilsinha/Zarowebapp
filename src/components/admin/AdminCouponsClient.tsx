"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X, Tag } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCouponsClient({ coupons }: { coupons: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const empty = { code: "", discount_type: "percentage", discount_value: "", min_order_value: "0", max_discount: "", usage_limit: "", valid_until: "", is_active: true };
  const [form, setForm] = useState<any>(empty);

  const handleSave = async () => {
    if (!form.code || !form.discount_value) { toast.error("Code and discount value required"); return; }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("coupons").insert({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order_value: parseFloat(form.min_order_value) || 0,
      max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      valid_until: form.valid_until || null,
      is_active: form.is_active,
    });
    if (error) { toast.error(error.message); setSaving(false); return; }
    toast.success("Coupon created!");
    setShowForm(false); setForm(empty); router.refresh(); setSaving(false);
  };

  const toggleActive = async (id: string, val: boolean) => {
    const supabase = createClient();
    await supabase.from("coupons").update({ is_active: val }).eq("id", id);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const supabase = createClient();
    await supabase.from("coupons").delete().eq("id", id);
    toast.success("Deleted"); router.refresh();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold">Coupons</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-playfair font-bold text-xl">New Coupon</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Coupon Code *</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Discount Type</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none bg-white">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Discount Value *</label>
                  <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder={form.discount_type === "percentage" ? "20" : "100"}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Min Order (₹)</label>
                  <input type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Max Discount (₹)</label>
                  <input type="number" value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: e.target.value })} placeholder="Optional"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Usage Limit</label>
                  <input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} placeholder="Unlimited"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Valid Until</label>
                  <input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-brand-500 w-4 h-4" />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Saving..." : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              {["Code", "Discount", "Min Order", "Used", "Valid Until", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-sm bg-accent px-2 py-1 rounded-lg flex items-center gap-1.5 w-fit">
                    <Tag size={11} /> {c.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">
                  {c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                  {c.max_discount && <span className="text-xs text-muted-foreground ml-1">max ₹{c.max_discount}</span>}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">₹{c.min_order_value}</td>
                <td className="px-4 py-3 text-sm">{c.used_count}{c.usage_limit ? `/${c.usage_limit}` : ""}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {c.valid_until ? new Date(c.valid_until).toLocaleDateString("en-IN") : "No expiry"}
                </td>
                <td className="px-4 py-3">
                  <div onClick={() => toggleActive(c.id, !c.is_active)}
                    className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${c.is_active ? "bg-brand-500" : "bg-gray-300"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${c.is_active ? "left-5" : "left-0.5"}`} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!coupons.length && <div className="py-10 text-center text-muted-foreground text-sm">No coupons yet</div>}
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPincodesClient({ pincodes }: { pincodes: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const empty = { pincode: "", area: "", delivery_type: "paid", delivery_charge: "50", delivery_time_hours: "48", is_bandra: false, is_same_day_available: false };
  const [form, setForm] = useState<any>(empty);

  const openEdit = (p: any) => { setForm({ ...p, delivery_charge: String(p.delivery_charge), delivery_time_hours: String(p.delivery_time_hours) }); setEditing(p); setShowForm(true); };
  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); };

  const handleSave = async () => {
    if (!form.pincode || !form.area) { toast.error("Pincode and area required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = { pincode: form.pincode, area: form.area, delivery_type: form.delivery_type, delivery_charge: parseFloat(form.delivery_charge) || 0, delivery_time_hours: parseInt(form.delivery_time_hours) || 48, is_bandra: form.is_bandra, is_same_day_available: form.is_same_day_available };
    if (editing) {
      await supabase.from("pincodes").update(payload).eq("id", editing.id);
      toast.success("Updated!");
    } else {
      await supabase.from("pincodes").insert(payload);
      toast.success("Pincode added!");
    }
    setShowForm(false); router.refresh(); setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pincode?")) return;
    const supabase = createClient();
    await supabase.from("pincodes").delete().eq("id", id);
    toast.success("Deleted"); router.refresh();
  };

  const DELIVERY_COLORS: Record<string, string> = {
    free: "bg-green-100 text-green-700",
    paid: "bg-blue-100 text-blue-700",
    not_available: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold">Delivery Pincodes</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Add Pincode
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-playfair font-bold text-xl">{editing ? "Edit Pincode" : "Add Pincode"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Pincode *</label>
                  <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="400050"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Area *</label>
                  <input type="text" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Bandra West"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Delivery Type</label>
                  <select value={form.delivery_type} onChange={(e) => setForm({ ...form, delivery_type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none bg-white">
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="not_available">Not Available</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Charge (₹)</label>
                  <input type="number" value={form.delivery_charge} onChange={(e) => setForm({ ...form, delivery_charge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Delivery Hours</label>
                  <input type="number" value={form.delivery_time_hours} onChange={(e) => setForm({ ...form, delivery_time_hours: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { key: "is_bandra", label: "Bandra area (free delivery eligible)" },
                  { key: "is_same_day_available", label: "Same-day delivery available" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="accent-brand-500 w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              {["Pincode", "Area", "Delivery", "Charge", "Hours", "Flags", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pincodes.map((p) => (
              <tr key={p.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-sm">{p.pincode}</td>
                <td className="px-4 py-3 text-sm">{p.area}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${DELIVERY_COLORS[p.delivery_type]}`}>
                    {p.delivery_type.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">₹{p.delivery_charge}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.delivery_time_hours}h</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {p.is_bandra && <span className="text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-md">Bandra</span>}
                    {p.is_same_day_available && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md">Same-day</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors"><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!pincodes.length && <div className="py-10 text-center text-muted-foreground text-sm">No pincodes added yet</div>}
      </div>
    </div>
  );
}
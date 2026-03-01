"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBannersClient({ banners }: { banners: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const empty = { image_url: "", title: "", subtitle: "", cta_text: "", cta_link: "", display_order: "0", is_active: true };
  const [form, setForm] = useState<any>(empty);

  const openEdit = (b: any) => { setForm({ ...b, display_order: String(b.display_order) }); setEditing(b); setShowForm(true); };
  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); };

  const handleSave = async () => {
    if (!form.image_url) { toast.error("Image URL required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = { image_url: form.image_url, title: form.title, subtitle: form.subtitle, cta_text: form.cta_text, cta_link: form.cta_link, display_order: parseInt(form.display_order) || 0, is_active: form.is_active };
    if (editing) {
      await supabase.from("hero_banners").update(payload).eq("id", editing.id);
      toast.success("Banner updated!");
    } else {
      await supabase.from("hero_banners").insert(payload);
      toast.success("Banner created!");
    }
    setShowForm(false); router.refresh(); setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const supabase = createClient();
    await supabase.from("hero_banners").delete().eq("id", id);
    toast.success("Deleted"); router.refresh();
  };

  const toggleActive = async (id: string, val: boolean) => {
    const supabase = createClient();
    await supabase.from("hero_banners").update({ is_active: val }).eq("id", id);
    router.refresh();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold">Hero Banners</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-playfair font-bold text-xl">{editing ? "Edit Banner" : "New Banner"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "image_url", label: "Image URL *", placeholder: "https://..." },
                { key: "title", label: "Title", placeholder: "Banner headline" },
                { key: "subtitle", label: "Subtitle", placeholder: "Supporting text" },
                { key: "cta_text", label: "Button Text", placeholder: "Shop Now" },
                { key: "cta_link", label: "Button Link", placeholder: "/shop" },
                { key: "display_order", label: "Display Order", placeholder: "0" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</label>
                  <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
              ))}
              {form.image_url && (
                <div className="rounded-xl overflow-hidden h-32 bg-cream-200">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-brand-500 w-4 h-4" />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl border border-border overflow-hidden flex items-center gap-4 p-4">
            <div className="w-32 h-20 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
              <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{banner.title || "No title"}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{banner.subtitle}</p>
              <p className="text-xs text-muted-foreground mt-1">Order: {banner.display_order} · {banner.cta_text || "No CTA"}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div onClick={() => toggleActive(banner.id, !banner.is_active)}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${banner.is_active ? "bg-brand-500" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${banner.is_active ? "left-5" : "left-0.5"}`} />
              </div>
              <button onClick={() => openEdit(banner)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors"><Edit2 size={15} /></button>
              <button onClick={() => handleDelete(banner.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {!banners.length && <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground text-sm">No banners yet</div>}
      </div>
    </div>
  );
}
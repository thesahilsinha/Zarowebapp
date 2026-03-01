"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminCategoriesClient({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const empty = { name: "", slug: "", image_url: "", type: "both", display_order: "0", is_active: true };
  const [form, setForm] = useState<any>(empty);

  const openEdit = (c: any) => { setForm({ ...c, display_order: String(c.display_order) }); setEditing(c); setShowForm(true); };
  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = { name: form.name, slug: form.slug || slugify(form.name), image_url: form.image_url || null, type: form.type, display_order: parseInt(form.display_order) || 0, is_active: form.is_active };
    if (editing) {
      await supabase.from("categories").update(payload).eq("id", editing.id);
      toast.success("Category updated!");
    } else {
      await supabase.from("categories").insert(payload);
      toast.success("Category created!");
    }
    setShowForm(false);
    router.refresh();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold">Categories</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-playfair font-bold text-xl">{editing ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "name", label: "Name *", placeholder: "e.g. Desserts" },
                { key: "slug", label: "Slug", placeholder: "e.g. desserts" },
                { key: "image_url", label: "Image URL", placeholder: "https://..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</label>
                  <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value, ...(key === "name" && !editing ? { slug: slugify(e.target.value) } : {}) })}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none bg-white">
                    <option value="both">Both</option>
                    <option value="freshly_bakes">Freshly Bakes</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })}
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
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              {["Category", "Slug", "Type", "Order", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cat.image_url && <div className="w-8 h-8 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0"><img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" /></div>}
                    <span className="font-medium text-sm">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{cat.slug}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{cat.type}</td>
                <td className="px-4 py-3 text-sm">{cat.display_order}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {cat.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors"><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!categories.length && <div className="py-10 text-center text-muted-foreground text-sm">No categories yet</div>}
      </div>
    </div>
  );
}
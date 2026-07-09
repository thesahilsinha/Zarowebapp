"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X, Zap, ShoppingBag } from "lucide-react";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";

const FLAVOURS = [
  "Chocolate", "Vanilla", "Strawberry", "Red Velvet", "Butterscotch",
  "Mango", "Blueberry", "Caramel", "Coffee", "Pineapple", "Black Forest",
];

export default function AdminCakesClient({ cakes }: { cakes: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const empty = {
    name: "", slug: "", description: "", category: "regular",
    price: "", discount_price: "", is_preorder: false,
    preorder_days: "2", is_active: true, is_best_seller: false,
    stock: "10", rating: "4.5", rating_count: "0",
    images: ["", "", "", ""],
    flavours: [] as string[],
    sizes: [{ label: "0.5kg", price: "" }, { label: "1kg", price: "" }],
  };
  const [form, setForm] = useState<any>(empty);

  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (c: any) => {
    const imgs = [...(c.images || [])];
    while (imgs.length < 4) imgs.push("");
    setForm({
      ...c,
      price: String(c.price || ""),
      discount_price: String(c.discount_price || ""),
      preorder_days: String(c.preorder_days || "2"),
      stock: String(c.stock || "10"),
      rating: String(c.rating || "4.5"),
      rating_count: String(c.rating_count || "0"),
      images: imgs,
      flavours: c.flavours || [],
      sizes: c.sizes?.length ? c.sizes : [{ label: "0.5kg", price: "" }, { label: "1kg", price: "" }],
    });
    setEditing(c);
    setShowForm(true);
  };

  const toggleFlavour = (f: string) => {
    setForm((prev: any) => ({
      ...prev,
      flavours: prev.flavours.includes(f)
        ? prev.flavours.filter((x: string) => x !== f)
        : [...prev.flavours, f],
    }));
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      category: form.category,
      price: form.price ? parseFloat(form.price) : null,
      discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      is_preorder: form.is_preorder,
      preorder_days: parseInt(form.preorder_days) || 2,
      is_active: form.is_active,
      is_best_seller: form.is_best_seller,
      stock: parseInt(form.stock) || 10,
      rating: parseFloat(form.rating) || 4.5,
      rating_count: parseInt(form.rating_count) || 0,
      images: form.images.filter((img: string) => img.trim()),
      flavours: form.flavours,
      sizes: form.sizes.filter((s: any) => s.price),
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error } = await supabase.from("cakes").update(payload).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); setSaving(false); return; }
      toast.success("Cake updated!");
    } else {
      const { error } = await supabase.from("cakes").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Cake created!");
    }
    setShowForm(false);
    router.refresh();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this cake?")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("cakes").delete().eq("id", id);
    toast.success("Deleted");
    router.refresh();
    setDeleting(null);
  };

  const filtered = cakes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold">Cakes</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> Add Cake
        </button>
      </div>

      {/* Search */}
      <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search cakes..."
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 mb-5" />

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-playfair font-bold text-xl">{editing ? "Edit Cake" : "New Cake"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-accent"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Name *</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none bg-white">
                    <option value="regular">Regular</option>
                    <option value="special">Special</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Base Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Starting price"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Size & Pricing</label>
                <div className="space-y-2">
                  {form.sizes.map((size: any, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" value={size.label}
                        onChange={(e) => {
                          const s = [...form.sizes]; s[i] = { ...s[i], label: e.target.value };
                          setForm({ ...form, sizes: s });
                        }}
                        placeholder="Size e.g. 0.5kg"
                        className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                      <input type="number" value={size.price}
                        onChange={(e) => {
                          const s = [...form.sizes]; s[i] = { ...s[i], price: e.target.value };
                          setForm({ ...form, sizes: s });
                        }}
                        placeholder="Price ₹"
                        className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                      <button onClick={() => setForm({ ...form, sizes: form.sizes.filter((_: any, j: number) => j !== i) })}
                        className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setForm({ ...form, sizes: [...form.sizes, { label: "", price: "" }] })}
                    className="text-xs text-brand-600 font-semibold hover:underline">+ Add Size</button>
                </div>
              </div>

              {/* Flavours */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Available Flavours</label>
                <div className="flex flex-wrap gap-2">
                  {FLAVOURS.map((f) => (
                    <button key={f} onClick={() => toggleFlavour(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        form.flavours.includes(f)
                          ? "bg-brand-500 text-white"
                          : "bg-accent text-muted-foreground hover:bg-brand-100"
                      }`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Image URLs</label>
                <div className="space-y-2">
                  {form.images.map((img: string, i: number) => (
                    <input key={i} type="text" value={img}
                      onChange={(e) => { const imgs = [...form.images]; imgs[i] = e.target.value; setForm({ ...form, images: imgs }); }}
                      placeholder={`Image ${i + 1} URL`}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                  ))}
                </div>
              </div>

              {/* Preorder settings */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_preorder}
                    onChange={(e) => setForm({ ...form, is_preorder: e.target.checked })}
                    className="accent-brand-500 w-4 h-4" />
                  <span className="text-sm font-semibold">Pre-order Only</span>
                </label>
                {form.is_preorder && (
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Days advance notice required</label>
                    <input type="number" value={form.preorder_days}
                      onChange={(e) => setForm({ ...form, preorder_days: e.target.value })}
                      className="w-32 px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                )}
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4">
                {[
                  { key: "is_best_seller", label: "Best Seller" },
                  { key: "is_active", label: "Active" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                      className="accent-brand-500 w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update Cake" : "Create Cake"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              {["Cake", "Category", "Sizes", "Flavours", "Type", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.map((cake) => (
              <tr key={cake.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cream-200 overflow-hidden flex-shrink-0">
                      {cake.images?.[0] && <img src={cake.images[0]} alt={cake.name} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{cake.name}</p>
                      <p className="text-xs text-muted-foreground">{cake.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm capitalize text-muted-foreground">{cake.category}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {cake.sizes?.length ? cake.sizes.map((s: any) => `${s.label}: ₹${s.price}`).join(", ") : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {cake.flavours?.slice(0, 3).map((f: string) => (
                      <span key={f} className="text-[10px] bg-accent px-1.5 py-0.5 rounded-md">{f}</span>
                    ))}
                    {cake.flavours?.length > 3 && <span className="text-[10px] text-muted-foreground">+{cake.flavours.length - 3}</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {cake.is_preorder
                    ? <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit"><Zap size={10} /> Pre-order</span>
                    : <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit"><ShoppingBag size={10} /> Ready</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cake.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {cake.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cake)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(cake.id)} disabled={deleting === cake.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!paginated.length && <div className="py-10 text-center text-muted-foreground text-sm">No cakes found</div>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-accent disabled:opacity-40 transition-colors">
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${page === p ? "bg-brand-500 text-white" : "border border-border hover:bg-accent"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-accent disabled:opacity-40 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
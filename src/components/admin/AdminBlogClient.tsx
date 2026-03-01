"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminBlogClient({ posts }: { posts: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const empty = { title: "", slug: "", excerpt: "", content: "", featured_image: "", category: "", author: "Zaro Bakehouse", is_published: false, published_at: "" };
  const [form, setForm] = useState<any>(empty);

  const openEdit = (p: any) => { setForm({ ...p, published_at: p.published_at ? p.published_at.split("T")[0] : "" }); setEditing(p); setShowForm(true); };
  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: form.title, slug: form.slug || slugify(form.title),
      excerpt: form.excerpt, content: form.content,
      featured_image: form.featured_image || null,
      category: form.category, author: form.author,
      is_published: form.is_published,
      published_at: form.is_published ? (form.published_at || new Date().toISOString()) : null,
    };
    if (editing) {
      await supabase.from("blog_posts").update(payload).eq("id", editing.id);
      toast.success("Post updated!");
    } else {
      await supabase.from("blog_posts").insert(payload);
      toast.success("Post created!");
    }
    setShowForm(false); router.refresh(); setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Deleted"); router.refresh();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-3xl font-bold">Blog Posts</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={16} /> New Post
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-playfair font-bold text-xl">{editing ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-accent"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {[
                { key: "title", label: "Title *", placeholder: "Post title" },
                { key: "slug", label: "Slug", placeholder: "url-friendly-slug" },
                { key: "featured_image", label: "Featured Image URL", placeholder: "https://..." },
                { key: "category", label: "Category", placeholder: "e.g. Recipes" },
                { key: "author", label: "Author", placeholder: "Zaro Bakehouse" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</label>
                  <input type="text" value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value, ...(key === "title" && !editing ? { slug: slugify(e.target.value) } : {}) })}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short summary..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} placeholder="Write your blog post content here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="accent-brand-500 w-4 h-4" />
                  <span className="text-sm font-medium">Published</span>
                </label>
                {form.is_published && (
                  <div className="flex-1">
                    <input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
              {post.featured_image && <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{post.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.excerpt}</p>
              <p className="text-xs text-muted-foreground mt-1">{post.category} · {post.author}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {post.is_published ? "Published" : "Draft"}
              </span>
              <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors"><Edit2 size={15} /></button>
              <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {!posts.length && <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground text-sm">No blog posts yet</div>}
      </div>
    </div>
  );
}
// ```1

// ---

// ## New files summary:
// ```
// src/app/blog/page.tsx
// src/app/blog/[slug]/page.tsx
// src/app/terms/page.tsx
// src/app/refund-policy/page.tsx
// src/app/privacy-policy/page.tsx
// src/app/payment-policy/page.tsx
// src/app/admin/banners/page.tsx
// src/app/admin/coupons/page.tsx
// src/app/admin/pincodes/page.tsx
// src/app/admin/tickets/page.tsx
// src/app/admin/blog/page.tsx
// src/components/PolicyLayout.tsx
// src/components/admin/AdminBannersClient.tsx
// src/components/admin/AdminCouponsClient.tsx
// src/components/admin/AdminPincodesClient.tsx
// src/components/admin/AdminTicketsClient.tsx
// src/components/admin/AdminBlogClient.tsx
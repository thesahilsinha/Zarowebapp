"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Save, CreditCard, Truck, Bell } from "lucide-react";

export default function AdminSettingsClient({ settings }: { settings: any }) {
  const [form, setForm] = useState({
    razorpay_enabled: settings.razorpay_enabled === true || settings.razorpay_enabled === "true",
    free_delivery_threshold: String(settings.free_delivery_threshold || "499"),
    same_day_cutoff_hour: String(settings.same_day_cutoff_hour || "14"),
    top_banner_text: settings.top_banner_text || "Free delivery on orders above ₹499 in Bandra",
    top_banner_active: settings.top_banner_active === true || settings.top_banner_active === "true",
    default_delivery_charge: String(settings.default_delivery_charge || "50"),
    contact_phone: settings.contact_phone || "+91 98201 53592",
    contact_email: settings.contact_email || "zarobakerhouse@gmail.com",
    instagram_url: settings.instagram_url || "https://instagram.com/zarobakehouse",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    const updates = Object.entries(form).map(([key, value]) => ({
      key,
      value: typeof value === "boolean" ? value : isNaN(Number(value)) || value === "" ? value : Number(value),
    }));
    for (const update of updates) {
      await supabase.from("settings").upsert({ key: update.key, value: update.value });
    }
    toast.success("Settings saved!");
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-playfair text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Payment */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold flex items-center gap-2 mb-5">
            <CreditCard size={18} className="text-brand-500" /> Payment
          </h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-sm">Enable Razorpay</p>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle online payment on/off for customers</p>
            </div>
            <div
              onClick={() => setForm({ ...form, razorpay_enabled: !form.razorpay_enabled })}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${form.razorpay_enabled ? "bg-brand-500" : "bg-gray-300"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.razorpay_enabled ? "left-7" : "left-1"}`} />
            </div>
          </label>
          {form.razorpay_enabled && (
            <p className="mt-3 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
              Razorpay is enabled. Make sure your keys are set in .env.local
            </p>
          )}
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold flex items-center gap-2 mb-5">
            <Truck size={18} className="text-brand-500" /> Delivery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { key: "free_delivery_threshold", label: "Free Delivery Threshold (₹)", placeholder: "499" },
              { key: "default_delivery_charge", label: "Default Delivery Charge (₹)", placeholder: "50" },
              { key: "same_day_cutoff_hour", label: "Same-Day Cutoff Hour (24h)", placeholder: "14" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</label>
                <input type="number" value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold flex items-center gap-2 mb-5">
            <Bell size={18} className="text-brand-500" /> Top Banner
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Banner Text</label>
              <input type="text" value={form.top_banner_text} onChange={(e) => setForm({ ...form, top_banner_text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setForm({ ...form, top_banner_active: !form.top_banner_active })}
                className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${form.top_banner_active ? "bg-brand-500" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.top_banner_active ? "left-5" : "left-0.5"}`} />
              </div>
              <span className="text-sm font-medium">Show top banner</span>
            </label>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold mb-5">Contact & Social</h2>
          <div className="space-y-3">
            {[
              { key: "contact_phone", label: "Phone" },
              { key: "contact_email", label: "Email" },
              { key: "instagram_url", label: "Instagram URL" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</label>
                <input type="text" value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-60">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          Save All Settings
        </button>
      </div>
    </div>
  );
}
// ```

// ---

// ## Make yourself admin

// Go to **Supabase → Table Editor → profiles** → find your user row → set `is_admin` to `true`.

// Then visit `localhost:3000/admin` — you should see the full admin dashboard.

// ---

// ## New files summary:
// ```
// src/app/dashboard/help/page.tsx
// src/app/admin/layout.tsx
// src/app/admin/page.tsx
// src/app/admin/orders/page.tsx
// src/app/admin/products/page.tsx
// src/app/admin/categories/page.tsx
// src/app/admin/settings/page.tsx
// src/components/admin/AdminSidebar.tsx
// src/components/admin/AdminOrdersClient.tsx
// src/components/admin/AdminProductsClient.tsx
// src/components/admin/AdminCategoriesClient.tsx
// src/components/admin/AdminSettingsClient.tsx
// src/components/dashboard/HelpDeskClient.tsx
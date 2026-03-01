"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function AddressesTab({ addresses, userId }: { addresses: any[]; userId: string }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "", phone: "", address_line1: "",
    address_line2: "", landmark: "", pincode: "", city: "Mumbai", state: "Maharashtra",
  });

  const saveAddress = async () => {
    if (!form.full_name || !form.phone || !form.address_line1 || !form.pincode) {
      toast.error("Please fill required fields"); return;
    }
    setSaving(true);
    const supabase = createClient();
    const isFirst = addresses.length === 0;
    const { error } = await supabase.from("addresses").insert({
      ...form, user_id: userId, is_default: isFirst,
    });
    if (error) { toast.error("Failed to save address"); }
    else { toast.success("Address saved!"); setShowForm(false); router.refresh(); }
    setSaving(false);
  };

  const deleteAddress = async (id: string) => {
    const supabase = createClient();
    await supabase.from("addresses").delete().eq("id", id);
    toast.success("Address removed");
    router.refresh();
  };

  const setDefault = async (id: string) => {
    const supabase = createClient();
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    toast.success("Default address updated");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair font-bold text-2xl">My Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={15} /> Add Address
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
          <h3 className="font-semibold text-sm">New Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "full_name", label: "Full Name", col: 1 },
              { key: "phone", label: "Phone", col: 1 },
              { key: "address_line1", label: "Address Line 1", col: 2 },
              { key: "address_line2", label: "Address Line 2 (Optional)", col: 2 },
              { key: "landmark", label: "Landmark (Optional)", col: 2 },
              { key: "pincode", label: "Pincode", col: 1 },
              { key: "city", label: "City", col: 1 },
            ].map(({ key, label, col }) => (
              <div key={key} className={col === 2 ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors">
              Cancel
            </button>
            <button
              onClick={saveAddress}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      )}

      {/* Address list */}
      {!addresses.length && !showForm ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <MapPin size={28} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No addresses saved</p>
          <p className="text-muted-foreground text-sm">Add a delivery address to speed up checkout</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-2xl border-2 p-4 transition-colors ${addr.is_default ? "border-brand-300 bg-brand-50/30" : "border-border"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{addr.full_name}</p>
                    {addr.is_default && (
                      <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={9} /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}
                  </p>
                  <p className="text-muted-foreground text-sm">{addr.city} — {addr.pincode}</p>
                  <p className="text-muted-foreground text-sm">{addr.phone}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {!addr.is_default && (
                    <button
                      onClick={() => setDefault(addr.id)}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium px-2 py-1 rounded-lg hover:bg-brand-50 transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ```
// 
// ---
// 
// ## Also — enable Email Auth in Supabase
// 
// Go to **Supabase → Authentication → Providers → Email** and make sure:
// - Email is **enabled**
// - "Confirm email" is **ON**
// 
// ---
// 
// ## New files summary:
// ```
// src/app/login/page.tsx
// src/app/register/page.tsx
// src/app/forgot-password/page.tsx
// src/app/auth/callback/route.ts
// src/app/dashboard/page.tsx
// src/components/auth/LoginClient.tsx
// src/components/auth/RegisterClient.tsx
// src/components/auth/ForgotPasswordClient.tsx
// src/components/dashboard/DashboardClient.tsx
// src/components/dashboard/OrdersTab.tsx
// src/components/dashboard/WishlistTab.tsx
// src/components/dashboard/ProfileTab.tsx
// src/components/dashboard/AddressesTab.tsx
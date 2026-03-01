"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Lock, Save } from "lucide-react";

export default function ProfileTab({ profile }: { profile: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name, phone: form.phone })
      .eq("id", profile.id);
    if (error) { toast.error("Failed to update profile"); }
    else { toast.success("Profile updated!"); router.refresh(); }
    setSaving(false);
  };

  const changePassword = async () => {
    if (passwords.newPass !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    if (passwords.newPass.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setChangingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass });
    if (error) { toast.error(error.message); }
    else { toast.success("Password updated!"); setPasswords({ current: "", newPass: "", confirm: "" }); }
    setChangingPassword(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="font-playfair font-bold text-2xl">My Profile</h2>

      {/* Profile info */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2 text-sm">
          <User size={16} className="text-brand-500" /> Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-accent text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
          Save Changes
        </button>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2 text-sm">
          <Lock size={16} className="text-brand-500" /> Change Password
        </h3>

        <div className="space-y-3">
          {[
            { key: "newPass", label: "New Password", placeholder: "Min 6 characters" },
            { key: "confirm", label: "Confirm New Password", placeholder: "••••••••" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{label}</label>
              <input
                type="password"
                value={passwords[key as keyof typeof passwords]}
                onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          ))}
        </div>

        <button
          onClick={changePassword}
          disabled={changingPassword}
          className="flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
        >
          {changingPassword ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={15} />}
          Update Password
        </button>
      </div>
    </div>
  );
}
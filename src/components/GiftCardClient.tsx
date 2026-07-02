"use client";
import { useState } from "react";
import { Gift, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const PRESET_AMOUNTS = [499, 999, 1499, 2499];

export default function GiftCardClient() {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [form, setForm] = useState({
    recipient_name: "",
    recipient_email: "",
    sender_name: "",
    message: "",
  });

  const amount = selected || (custom ? parseInt(custom) : 0);

  const handleWhatsApp = () => {
    if (!amount || amount < 100) { toast.error("Please select or enter an amount"); return; }
    if (!form.recipient_name || !form.recipient_email) { toast.error("Please fill recipient details"); return; }
    const msg = encodeURIComponent(
      `Hi Zaro Bakehouse! I'd like to purchase a Gift Card.\n\n` +
      `Amount: ₹${amount}\n` +
      `For: ${form.recipient_name} (${form.recipient_email})\n` +
      `From: ${form.sender_name || "Anonymous"}\n` +
      `Message: ${form.message || "None"}\n\n` +
      `Please share payment details to complete the purchase.`
    );
    window.open(`https://wa.me/919820153592?text=${msg}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Gift size={28} className="text-brand-600" />
        </div>
        <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-2">The Perfect Gift</p>
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-3">Zaro Gift Cards</h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">Give the gift of fresh bakes. Our gift cards never expire and can be used on any order.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Amount selector */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Select Amount</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amt) => (
              <button key={amt} onClick={() => { setSelected(amt); setCustom(""); }}
                className={`py-4 rounded-2xl font-bold text-lg border-2 transition-all ${selected === amt ? "border-brand-500 bg-brand-50 text-brand-600" : "border-border bg-white text-foreground hover:border-brand-300"}`}>
                ₹{amt.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Custom Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
              <input
                type="number"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                placeholder="Enter amount (min ₹100)"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          {/* Preview card */}
          {amount > 0 && (
            <div className="mt-6 bg-gradient-to-br from-forest-800 to-forest-600 rounded-2xl p-6 text-white">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Zaro Bakehouse</p>
              <p className="font-playfair text-3xl font-bold mb-3">₹{amount.toLocaleString("en-IN")}</p>
              <p className="text-white/70 text-sm">{form.recipient_name ? `For: ${form.recipient_name}` : "Gift Card"}</p>
              {form.message && <p className="text-white/60 text-xs mt-2 italic">"{form.message}"</p>}
              <p className="text-white/30 text-xs mt-4">Valid for all orders · No expiry</p>
            </div>
          )}
        </div>

        {/* Recipient details */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Recipient Details</h2>
          <div className="space-y-4">
            {[
              { key: "recipient_name", label: "Recipient Name *", placeholder: "Who is this for?" },
              { key: "recipient_email", label: "Recipient Email *", placeholder: "Where to send the gift card" },
              { key: "sender_name", label: "Your Name", placeholder: "From (optional)" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{label}</label>
                <input
                  type={key === "recipient_email" ? "email" : "text"}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Personal Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Add a personal note..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-xs font-semibold mb-1">Payment via WhatsApp</p>
            <p className="text-amber-700 text-xs leading-relaxed">Gift card purchases are processed manually. We'll send you payment details via WhatsApp and deliver the gift card to the recipient's email within 2 hours of payment.</p>
          </div>

          <button onClick={handleWhatsApp}
            className="w-full mt-5 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
            <MessageCircle size={18} />
            Purchase via WhatsApp {amount > 0 ? `· ₹${amount.toLocaleString("en-IN")}` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
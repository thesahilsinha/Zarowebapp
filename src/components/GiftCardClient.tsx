"use client";
import { useState } from "react";
import { Gift, CreditCard, Check } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const PRESET_AMOUNTS = [499, 999, 1499, 2499];

export default function GiftCardClient() {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [step, setStep] = useState<"select" | "details" | "success">("select");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [form, setForm] = useState({
    recipient_name: "",
    recipient_email: "",
    sender_name: "",
    message: "",
  });

  const amount = selected || (custom ? parseInt(custom) : 0);

  const handleProceed = () => {
    if (!amount || amount < 100) { toast.error("Minimum gift card amount is ₹100"); return; }
    setStep("details");
  };

  const handlePurchase = async () => {
    if (!form.recipient_name || !form.recipient_email) {
      toast.error("Please fill recipient name and email"); return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user
        ? await supabase.from("profiles").select("full_name, email").eq("id", user.id).single()
        : { data: null };

      const res = await fetch("/api/gift-cards/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          recipient_name: form.recipient_name,
          recipient_email: form.recipient_email,
          sender_name: form.sender_name || profile?.full_name || "Anonymous",
          message: form.message,
          purchased_by_user_id: user?.id || null,
          purchased_by_name: profile?.full_name || form.sender_name,
          purchased_by_email: profile?.email || "",
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to purchase gift card");

      setGeneratedCode(data.code);
      setStep("success");
      toast.success("Gift card purchased successfully!");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check size={28} className="text-green-600" />
        </div>
        <h1 className="font-playfair text-3xl font-bold mb-3">Gift Card Sent!</h1>
        <p className="text-muted-foreground text-sm mb-8">
          The gift card has been sent to <strong>{form.recipient_email}</strong> with the code below.
        </p>
        <div className="bg-forest-800 rounded-2xl p-8 text-white text-center mb-6">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Gift Card Code</p>
          <p className="font-mono text-3xl font-bold tracking-widest">{generatedCode}</p>
          <p className="text-white/40 text-xs mt-3">₹{amount.toLocaleString("en-IN")} · Single use · No expiry</p>
        </div>
        <button onClick={() => { setStep("select"); setSelected(null); setCustom(""); setForm({ recipient_name: "", recipient_email: "", sender_name: "", message: "" }); }}
          className="text-brand-600 text-sm font-semibold hover:underline">
          Buy Another Gift Card
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Gift size={26} className="text-brand-600" />
        </div>
        <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-2">The Perfect Gift</p>
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-3">Zaro Gift Cards</h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">Give the gift of fresh bakes. Redeemable at checkout on any order.</p>
      </div>

      {step === "select" && (
        <div className="max-w-lg mx-auto">
          <h2 className="font-semibold text-foreground mb-4">Select Amount</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amt) => (
              <button key={amt} onClick={() => { setSelected(amt); setCustom(""); }}
                className={`py-5 rounded-2xl font-bold text-xl border-2 transition-all ${
                  selected === amt ? "border-brand-500 bg-brand-50 text-brand-600" : "border-border bg-white text-foreground hover:border-brand-300"
                }`}>
                ₹{amt.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Custom Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
              <input type="number" value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                placeholder="Enter amount (min ₹100)"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          </div>

          {amount > 0 && (
            <div className="bg-forest-800 rounded-2xl p-6 text-white text-center mb-6">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Gift Card Value</p>
              <p className="font-playfair text-4xl font-bold">₹{amount.toLocaleString("en-IN")}</p>
              <p className="text-white/40 text-xs mt-2">Single use · No expiry · Valid on all orders</p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 text-xs font-semibold mb-1 flex items-center gap-1.5">
              <CreditCard size={13} /> Online Payment Only
            </p>
            <p className="text-amber-700 text-xs leading-relaxed">Gift cards can only be purchased via online payment (Razorpay). The gift card code will be emailed to the recipient immediately after payment.</p>
          </div>

          <button onClick={handleProceed} disabled={!amount || amount < 100}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-4 rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Continue {amount > 0 ? `· ₹${amount.toLocaleString("en-IN")}` : ""}
          </button>
        </div>
      )}

      {step === "details" && (
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep("select")} className="text-muted-foreground hover:text-foreground text-sm">← Back</button>
            <h2 className="font-semibold">Recipient Details</h2>
          </div>

          <div className="space-y-4 mb-6">
            {[
              { key: "recipient_name", label: "Recipient Name *", placeholder: "Who is this for?", type: "text" },
              { key: "recipient_email", label: "Recipient Email *", placeholder: "Gift card will be sent here", type: "email" },
              { key: "sender_name", label: "Your Name", placeholder: "From (optional)", type: "text" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{label}</label>
                <input type={type} value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Personal Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Add a personal note..." rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-5 mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Gift Card Amount</span>
              <span className="font-bold">₹{amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold text-brand-600">Online Payment (Razorpay)</span>
            </div>
          </div>

          <button onClick={handlePurchase} disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-4 rounded-2xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              : <><CreditCard size={17} /> Pay ₹{amount.toLocaleString("en-IN")} & Send Gift Card</>
            }
          </button>
        </div>
      )}
    </div>
  );
}
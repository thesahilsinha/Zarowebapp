"use client";
import { useState } from "react";
import { Search, Gift, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminGiftCardsClient({ giftCards }: { giftCards: any[] }) {
  const [search, setSearch] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const router = useRouter();

  const filtered = giftCards.filter((g) =>
    g.code?.toLowerCase().includes(search.toLowerCase()) ||
    g.recipient_email?.toLowerCase().includes(search.toLowerCase()) ||
    g.recipient_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch("/api/gift-cards/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode }),
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch {
      toast.error("Failed to verify");
    }
    setVerifying(false);
  };

  const handleMarkUsed = async (code: string) => {
    setMarking(code);
    try {
      await fetch("/api/gift-cards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, order_number: "MANUAL" }),
      });
      toast.success("Gift card marked as used");
      router.refresh();
      setVerifyResult(null);
      setVerifyCode("");
    } catch {
      toast.error("Failed to mark as used");
    }
    setMarking(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Gift size={24} className="text-brand-500" />
        <h1 className="font-playfair text-3xl font-bold">Gift Cards</h1>
      </div>

      {/* Verify bar */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-6">
        <p className="text-sm font-semibold mb-3">Verify a Gift Card</p>
        <div className="flex gap-3">
          <input type="text" value={verifyCode}
            onChange={(e) => { setVerifyCode(e.target.value.toUpperCase()); setVerifyResult(null); }}
            placeholder="Enter gift card code e.g. ZAROXXX123"
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-400" />
          <button onClick={handleVerify} disabled={verifying}
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
            {verifying ? "Checking..." : "Verify"}
          </button>
        </div>

        {verifyResult && (
          <div className={`mt-4 rounded-xl p-4 flex items-start justify-between ${verifyResult.valid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className="flex items-start gap-3">
              {verifyResult.valid
                ? <Check size={18} className="text-green-600 mt-0.5" />
                : <X size={18} className="text-red-600 mt-0.5" />
              }
              <div>
                {verifyResult.valid ? (
                  <>
                    <p className="font-semibold text-green-800 text-sm">Valid Gift Card</p>
                    <p className="text-green-700 text-xs mt-0.5">Amount: <strong>₹{verifyResult.amount}</strong></p>
                    <p className="text-green-600 text-xs">For: {verifyResult.giftCard?.recipient_name} ({verifyResult.giftCard?.recipient_email})</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-red-800 text-sm">Invalid Gift Card</p>
                    <p className="text-red-700 text-xs mt-0.5">{verifyResult.message}</p>
                  </>
                )}
              </div>
            </div>
            {verifyResult.valid && (
              <button
                onClick={() => handleMarkUsed(verifyCode)}
                disabled={marking === verifyCode}
                className="bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0">
                {marking === verifyCode ? "Marking..." : "Mark as Used"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              {["Code", "Amount", "Recipient", "Purchased By", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((gc) => (
              <tr key={gc.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-sm bg-accent px-2 py-1 rounded-lg">{gc.code}</span>
                </td>
                <td className="px-4 py-3 font-bold text-sm">₹{gc.amount?.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">{gc.recipient_name}</p>
                  <p className="text-xs text-muted-foreground">{gc.recipient_email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm">{gc.purchased_by_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{gc.purchased_by_email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    gc.is_used ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                  }`}>
                    {gc.is_used ? `Used${gc.used_on_order ? ` · #${gc.used_on_order}` : ""}` : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!gc.is_used && (
                    <button onClick={() => handleMarkUsed(gc.code)} disabled={marking === gc.code}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50">
                      {marking === gc.code ? "..." : "Mark Used"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <div className="py-10 text-center text-muted-foreground text-sm">No gift cards found</div>}
      </div>
    </div>
  );
}
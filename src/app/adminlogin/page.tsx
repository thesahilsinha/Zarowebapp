"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Zaro2025admin") {
      document.cookie = "admin_auth=zaro2024admin; path=/; max-age=86400";
      router.push("/admin");
      router.refresh();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-card p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl font-playfair">Z</span>
          </div>
          <h1 className="font-playfair text-2xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter admin password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">Incorrect password</p>}
          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Enter Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
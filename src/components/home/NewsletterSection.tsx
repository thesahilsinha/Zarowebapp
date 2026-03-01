"use client";
import { useState } from "react";
import { Instagram } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("You're subscribed! Welcome to the Zaro family.");
    setEmail("");
  };

  return (
    <section className="bg-brand-500 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Stay in the loop</p>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-3">Join Our Community</h2>
        <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-md mx-auto">
          Be the first to know about new products, seasonal specials, and exclusive offers — just good things.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 transition-all text-sm"
            />
            <button type="submit"
              className="bg-white text-brand-600 font-bold px-6 py-3.5 rounded-xl hover:bg-cream-100 transition-colors text-sm whitespace-nowrap">
              Subscribe
            </button>
          </form>
        ) : (
          <div className="bg-white/20 border border-white/30 rounded-xl px-6 py-4 max-w-md mx-auto mb-6">
            <p className="text-white font-semibold">You're subscribed! Welcome to the Zaro family.</p>
          </div>
        )}

        <a href="https://instagram.com/zarobakehouse" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
          <Instagram size={16} />
          Follow us on Instagram
        </a>
      </div>
    </section>
  );
}
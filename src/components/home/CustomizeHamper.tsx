"use client";
import { motion } from "framer-motion";
import { Wrench, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CustomizeHamper() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("We'll notify you when this feature launches!");
    setEmail("");
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-brand-200 bg-cream-100 p-10 md:p-16 text-center">
          {/* Under maintenance overlay feel */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(212,136,42,0.03)_20px,rgba(212,136,42,0.03)_40px)]" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Wrench size={28} className="text-brand-500" />
            </div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Coming Soon
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
              Customize Your Hamper
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed mb-8">
              Build your perfect gift box — choose your products, packaging, and personal message. We're putting the finishing touches on this feature.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                <Mail size={15} />
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
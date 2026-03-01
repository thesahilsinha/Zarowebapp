"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, ChevronRight } from "lucide-react";

export default function HamperBanner() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-8 md:p-14"
        >
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />
          <div className="absolute top-8 right-32 w-20 h-20 bg-brand-500/30 rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Gift size={14} />
                Gifting made beautiful
              </div>
              <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold mb-3">
                Our Hampers
              </h2>
              <p className="text-white/70 text-base max-w-md leading-relaxed">
                Curated gift boxes filled with our finest bakes. Perfect for every occasion — birthdays, festivals, and everything in between.
              </p>
            </div>
            <Link
              href="/categories/hampers"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-2xl hover:bg-brand-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Explore Hampers
              <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
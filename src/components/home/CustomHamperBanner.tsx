import Link from "next/link";
import { Gift, Package } from "lucide-react";

export default function CustomHamperBanner() {
  return (
    <section className="bg-cream-200 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Custom Hamper */}
        <Link href="/custom-hamper"
          className="group bg-forest-800 rounded-3xl p-8 flex items-center gap-6 hover:bg-forest-700 transition-colors">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
            <Package size={26} className="text-white" />
          </div>
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Build Your Own</p>
            <h3 className="font-playfair text-xl font-bold text-white mb-1">Custom Hamper</h3>
            <p className="text-white/60 text-xs leading-relaxed">Pick any items from our menu and we'll pack it beautifully.</p>
          </div>
        </Link>

        {/* Gift Cards */}
        <Link href="/gift-cards"
          className="group bg-brand-500 rounded-3xl p-8 flex items-center gap-6 hover:bg-brand-600 transition-colors">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
            <Gift size={26} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">The Perfect Gift</p>
            <h3 className="font-playfair text-xl font-bold text-white mb-1">Gift Cards</h3>
            <p className="text-white/80 text-xs leading-relaxed">₹499 · ₹999 · ₹1499 · ₹2499 or custom amount.</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
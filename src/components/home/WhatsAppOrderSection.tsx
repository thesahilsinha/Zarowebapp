import Link from "next/link";
import { MessageCircle, ChevronRight } from "lucide-react";

const POPULAR = [
  "Custom Birthday Cake",
  "Corporate Hampers",
  "Wedding Favours",
  "Festive Gift Boxes",
  "Bulk Cookie Orders",
];

export default function WhatsAppOrderSection() {
  const phone = "919820153592";
  const message = encodeURIComponent("Hi Zaro Bakehouse! I'd like to place a custom order.");

  return (
    <section className="bg-forest-800 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div>
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Something Special?
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Place a Custom Order via WhatsApp
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Want a custom cake, bulk hampers, or a special treat for your event? Chat with us directly on WhatsApp and we'll sort it out for you.
            </p>
            <Link
              href={`https://wa.me/${phone}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-sm"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Right — popular requests */}
          <div className="space-y-3">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
              Popular Custom Requests
            </p>
            {POPULAR.map((item) => (
              <Link
                key={item}
                href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi Zaro! I'd like to order: ${item}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-5 py-3.5 transition-all group"
              >
                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                  {item}
                </span>
                <ChevronRight size={15} className="text-white/30 group-hover:text-brand-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
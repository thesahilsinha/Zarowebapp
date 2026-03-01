import Link from "next/link";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

export default function Footer() {
  const links = {
    shop: [
      { label: "All Products", href: "/shop" },
      { label: "Freshly Baked", href: "/shop?type=freshly_bakes" },
      { label: "Hampers", href: "/categories/hampers" },
      { label: "Festives", href: "/categories/festives" },
    ],
    help: [
      { label: "My Orders", href: "/dashboard/orders" },
      { label: "Help Desk", href: "/dashboard/help" },
      { label: "Track Order", href: "/dashboard/orders" },
      { label: "Contact Us", href: "mailto:zarobakerhouse@gmail.com" },
    ],
    legal: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Payment Policy", href: "/payment-policy" },
    ],
  };

  return (
    <footer className="bg-forest-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src="/logo.svg" alt="Zaro Bakehouse" className="h-16 w-auto brightness-0 invert" />
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Artisan bakes crafted with love, delivered fresh to your door in Bandra and beyond.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-brand-400" />
                <span>Shop No 10, Shiv Darshan, 33rd Road, Bandra West, Mumbai 400050</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <Phone size={15} className="flex-shrink-0 text-brand-400" />
                <a href="tel:+919820153592" className="hover:text-white transition-colors">+91 98201 53592</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <Mail size={15} className="flex-shrink-0 text-brand-400" />
                <a href="mailto:zarobakerhouse@gmail.com" className="hover:text-white transition-colors">zarobakerhouse@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {links.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">Help</h4>
            <ul className="space-y-2.5">
              {links.help.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {links.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              
                <a href="https://instagram.com/zarobakehouse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <Instagram size={16} className="text-brand-400" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Zaro Bakehouse. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Made with care in Bandra, Mumbai
          </p>
        </div>
      </div>
    </footer>
  );
}
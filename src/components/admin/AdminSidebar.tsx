"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, Tag,
  Users, MapPin, Ticket, FileText, Settings,
  Image, LogOut, ChevronRight, Gift, Menu, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/gift-cards", label: "Gift Cards", icon: Gift },
  { href: "/admin/pincodes", label: "Pincodes", icon: MapPin },
  { href: "/admin/tickets", label: "Help Desk", icon: FileText },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; max-age=0";
    router.push("/adminlogin");
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== "/admin";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold font-playfair">Z</span>
          </div>
          <div>
            <p className="font-playfair font-bold text-sm leading-none text-white">Zaro</p>
            <p className="text-[9px] tracking-widest text-white/40 uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact) || (exact && pathname === "/admin");
          return (
            <Link key={href} href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-brand-500 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link href="/" onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors mb-1">
          <ChevronRight size={16} className="rotate-180" />
          View Store
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-colors">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-foreground text-white flex-col min-h-screen flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-foreground text-white px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-playfair text-sm">Z</span>
          </div>
          <p className="font-playfair font-bold text-sm text-white">Zaro Admin</p>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-foreground text-white flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile top padding spacer */}
      <div className="md:hidden h-14 flex-shrink-0" />
    </>
  );
}
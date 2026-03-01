"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, User, Heart, Search, Menu, X, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { useRouter } from "next/navigation";

const NAV = [
  {
    label: "Shop All",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop" },
      { label: "Freshly Baked", href: "/shop?type=freshly_bakes" },
      { label: "Desserts", href: "/categories/desserts" },
      { label: "Breads", href: "/categories/flatbreads" },
    ],
  },
  {
    label: "Hampers",
    href: "/categories/our-hampers",
    children: null,
  },
  {
    label: "Freshly Baked",
    href: "/shop?type=freshly_bakes",
    children: null,
  },
  {
    label: "Blog",
    href: "/blog",
    children: null,
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { totalItems, setCartOpen } = useCart();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>

        {/* Main nav bar */}
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 h-20">

              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <img src="/logo.svg" alt="Zaro Bakehouse" className="h-20 w-auto" />
              </Link>

              {/* Search bar — center, desktop */}
              <div className="hidden md:flex flex-1 max-w-xl mx-auto">
                <form onSubmit={handleSearch} className="w-full flex items-center bg-cream-200 rounded-xl overflow-hidden border border-border hover:border-brand-400 transition-colors">
                  <select className="bg-transparent px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none border-r border-border cursor-pointer">
                    <option>All</option>
                    <option>Freshly Baked</option>
                    <option>Hampers</option>
                    <option>Desserts</option>
                  </select>
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for anything..."
                    className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <button type="submit" className="px-4 py-2.5 text-muted-foreground hover:text-brand-500 transition-colors">
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-1 ml-auto">
                {/* Mobile search */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="md:hidden p-2.5 rounded-xl hover:bg-accent transition-colors"
                >
                  <Search size={20} className="text-foreground" />
                </button>

                {/* Wishlist */}
                <Link href={user ? "/dashboard?tab=wishlist" : "/login"}
                  className="hidden sm:flex p-2.5 rounded-xl hover:bg-accent transition-colors">
                  <Heart size={20} className="text-foreground" />
                </Link>

                {/* Account */}
                <Link href={user ? "/dashboard" : "/login"}
                  className="hidden sm:flex items-center gap-1.5 p-2.5 rounded-xl hover:bg-accent transition-colors">
                  <User size={20} className="text-foreground" />
                </Link>

                {/* Cart */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white pl-4 pr-5 py-2.5 rounded-xl transition-colors ml-1"
                >
                  <ShoppingBag size={18} />
                  <span className="text-sm font-semibold hidden sm:block">Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Mobile menu */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2.5 rounded-xl hover:bg-accent transition-colors ml-1"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary nav — categories */}
        <div className="hidden md:block bg-white border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 h-11">
              {NAV.map((item) => (
                <div key={item.href} className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}>
                  <Link href={item.href}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-brand-600 transition-colors whitespace-nowrap">
                    {item.label}
                    {item.children && <ChevronDown size={13} className="text-muted-foreground" />}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 bg-white border border-border rounded-2xl shadow-card p-2 min-w-44 z-50"
                      >
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href}
                            className="block px-4 py-2.5 text-sm rounded-xl hover:bg-accent hover:text-brand-600 transition-colors whitespace-nowrap">
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
                <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                <Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-border overflow-hidden"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 flex items-center bg-cream-200 rounded-xl overflow-hidden border border-border">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for anything..."
                    className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none"
                  />
                  <button type="submit" className="px-3">
                    <Search size={16} className="text-muted-foreground" />
                  </button>
                </div>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground">
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-4 rounded-xl text-sm font-medium hover:bg-accent transition-colors">
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-border mt-2 pt-2 space-y-1">
                  <Link href={user ? "/dashboard" : "/login"} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium hover:bg-accent transition-colors">
                    <User size={16} /> {user ? "My Account" : "Login / Register"}
                  </Link>
                  <Link href={user ? "/dashboard?tab=wishlist" : "/login"} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium hover:bg-accent transition-colors">
                    <Heart size={16} /> Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />
    </>
  );
}
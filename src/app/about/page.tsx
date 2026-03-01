import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = { title: "About Us | Zaro Bakehouse" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        {/* Hero */}
        <div className="relative bg-forest-800 text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1400&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="relative max-w-3xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">Our Story</p>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-5 leading-tight">Baked with Love,<br />Delivered Fresh</h1>
            <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto">
              A little bakery tucked into the heart of Bandra West — where every item is made by hand, baked fresh daily, and packed with care.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-3">Who We Are</p>
              <h2 className="font-playfair text-3xl font-bold text-foreground mb-5">A Bakery Born from Passion</h2>
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>Zaro Bakehouse is a boutique artisan bakery located in Bandra West, Mumbai. Founded by Roshni, the bakery was born out of a deep love for handcrafted bakes — made with premium ingredients, no preservatives, and a whole lot of heart.</p>
                <p>Every item on our menu is made fresh daily — from our signature croissants and sourdough loaves to indulgent cheesecakes, tres leches, and tiramisu. We believe great baking takes time, and we never rush it.</p>
                <p>Whether you walk in for your morning pastry or order a curated hamper for a loved one, every experience at Zaro is crafted to feel special.</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden aspect-square bg-cream-200">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"
                alt="Zaro Bakehouse"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-cream-200 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">What Makes Us Different</h2>
              <p className="text-muted-foreground text-sm">The values we bake into everything we make.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Always Fresh",
                  desc: "Everything is baked fresh every morning. No frozen stock, no day-old pastries — ever.",
                  icon: "🥐",
                },
                {
                  title: "Premium Ingredients",
                  desc: "We source the finest ingredients — real butter, fresh cream, imported chocolate, and seasonal fruit.",
                  icon: "✨",
                },
                {
                  title: "Made with Care",
                  desc: "Every item is handcrafted in small batches. You can taste the difference that care makes.",
                  icon: "❤️",
                },
              ].map((val) => (
                <div key={val.title} className="bg-white rounded-2xl p-7 border border-border text-center">
                  <div className="text-4xl mb-4">{val.icon}</div>
                  <h3 className="font-playfair font-bold text-lg text-foreground mb-2">{val.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden aspect-video bg-cream-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.836!3d19.059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzMyLjQiTiA3MsKwNTAnMTAuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
            </div>
            <div>
              <p className="text-brand-500 text-xs font-semibold uppercase tracking-widest mb-3">Find Us</p>
              <h2 className="font-playfair text-3xl font-bold text-foreground mb-5">Visit the Bakery</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground text-base">Zaro Bakehouse</p>
                <p>Shop No 10, Shiv Darshan, 33rd Road,<br />Bandra West, Mumbai 400050</p>
                <p>Mon – Sun: 8:00 AM – 8:00 PM</p>
                <p>Phone: <a href="tel:+919820153592" className="text-brand-600 hover:underline">+91 98201 53592</a></p>
                <p>Email: <a href="mailto:zarobakerhouse@gmail.com" className="text-brand-600 hover:underline">zarobakerhouse@gmail.com</a></p>
              </div>
              <Link href="/contact"
                className="inline-block mt-6 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
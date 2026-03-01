import Link from "next/link";

const EXPERIENCES = [
  {
    title: "Freshly Baked Daily",
    description: "Every item is baked fresh each morning using premium ingredients. No preservatives, no shortcuts.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    href: "/shop?type=freshly_bakes",
  },
  {
    title: "Artisan Desserts",
    description: "From classic cheesecakes to modern patisserie — indulgent desserts crafted with love.",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
    href: "/categories/desserts",
  },
  {
    title: "Curated Hampers",
    description: "Thoughtfully curated gift hampers for every occasion — birthdays, festivals, and corporate gifting.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    href: "/categories/our-hampers",
  },
  {
    title: "Visit Our Bakery",
    description: "Drop by Shop No 10, Shiv Darshan, 33rd Road, Bandra West. We'd love to see you.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
    href: "/blog",
  },
];

export default function ExperienceSection() {
  return (
    <section className="bg-cream-200 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">The Zaro Bakehouse Experience</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">From freshly baked croissants to indulgent hampers — here's everything we have for you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EXPERIENCES.map((exp) => (
            <Link key={exp.title} href={exp.href} className="group bg-white rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden bg-cream-300">
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-playfair font-bold text-base text-foreground mb-1.5 group-hover:text-brand-600 transition-colors">{exp.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{exp.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
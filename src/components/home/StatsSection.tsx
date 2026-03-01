const STATS = [
  { value: "500+", label: "Happy Customers" },
  { value: "1,200+", label: "Orders Delivered" },
  { value: "4.9★", label: "Google Rating" },
  { value: "Bandra", label: "Delivery Available" },
];

export default function StatsSection() {
  return (
    <section className="bg-forest-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-3xl font-bold text-white mb-2">Trusted in Bandra</h2>
          <p className="text-white/60 text-sm max-w-md mx-auto">From everyday indulgences to festive gifting — Zaro Bakehouse is Bandra's go-to bakery.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="border border-white/20 rounded-2xl p-6 text-center hover:border-brand-400 transition-colors">
              <p className="font-playfair text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
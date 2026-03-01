const REVIEWS = [
  {
    name: "Priyanka Dhingra",
    initial: "P",
    rating: 5,
    title: "Such a lovely find in Bandra.",
    text: "My son and I accidentally stumbled upon this quaint little bakery in Bandra, and it was such a lovely find. The owner, Roshni, was incredibly helpful and took the time to explain her wide range of products — from preserves and jams to syrups.",
    color: "bg-brand-500",
  },
  {
    name: "Hayden Misquitta",
    initial: "H",
    rating: 5,
    title: "Good boutique bakehouse, everything in-house.",
    text: "Had visited this place today, it's a good boutique bakehouse where everything is made in house. Their almond strawberry croissant was yum, freshly baked and crisp excellent. Plus tried their strawberry matcha drink.",
    color: "bg-forest-500",
  },
  {
    name: "Shraddha Gandhi",
    initial: "S",
    rating: 5,
    title: "Beautiful, cozy, awesome.",
    text: "Its beautiful, cozy, awesome. I tried savoury and strawberry chocolate pudding — wow, its the bestest. Pudding was moist with strawberry compote on top. It just melts in the mouth, it was so special.",
    color: "bg-forest-800",
  },
];

export default function ReviewsSection() {
  return (
    <section className="bg-cream-200 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">What Our Customers Say</h2>
          <p className="text-muted-foreground text-sm">Read what our regulars have to say about us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((review) => (
            <div key={review.name} className="bg-white rounded-2xl p-6 border border-border hover:shadow-card transition-all duration-300">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-brand-500" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <h3 className="font-playfair font-bold text-base text-foreground mb-2">{review.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{review.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${review.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{review.initial}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">— {review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
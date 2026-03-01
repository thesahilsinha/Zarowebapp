import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";
import type { BlogPost } from "@/types";

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-500 text-sm font-medium tracking-widest uppercase mb-2">
              From Our Kitchen
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              Stories & Recipes
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm group"
          >
            All posts <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl bg-white border border-border hover:shadow-card-hover transition-all duration-300"
            >
              <div className="aspect-[16/9] bg-cream-200 overflow-hidden">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-100 to-cream-200" />
                )}
              </div>
              <div className="p-5">
                {post.category && (
                  <span className="text-brand-600 text-xs font-semibold uppercase tracking-wide">
                    {post.category}
                  </span>
                )}
                <h3 className="font-playfair font-bold text-lg mt-1 mb-2 text-foreground group-hover:text-brand-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-3 text-muted-foreground text-xs">
                  <Calendar size={12} />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
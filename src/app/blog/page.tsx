import { createClient } from "@/lib/supabase/server";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Blog | Zaro Bakehouse",
  description: "Stories, recipes and baking tips from the Zaro Bakehouse kitchen.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-50 via-cream-100 to-brand-100 py-14 px-4 text-center">
          <p className="text-brand-500 text-sm font-medium tracking-widest uppercase mb-2">From Our Kitchen</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-3">Stories & Recipes</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">Behind the scenes, baking tips, and stories from the Zaro Bakehouse team.</p>
        </div>

        {/* Posts grid */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {!posts?.length ? (
            <div className="text-center py-20 text-muted-foreground">No posts published yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300">
                  <div className="aspect-[16/9] bg-cream-200 overflow-hidden">
                    {post.featured_image
                      ? <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-gradient-to-br from-brand-100 to-cream-200" />
                    }
                  </div>
                  <div className="p-5">
                    {post.category && <span className="text-brand-600 text-xs font-semibold uppercase tracking-wide">{post.category}</span>}
                    <h2 className="font-playfair font-bold text-lg mt-1 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">{post.title}</h2>
                    {post.excerpt && <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-3">{post.excerpt}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Calendar size={12} />
                        {post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
                      </div>
                      <span className="text-brand-600 text-xs font-semibold flex items-center gap-1">
                        Read <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
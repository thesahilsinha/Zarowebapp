import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, ArrowLeft, User } from "lucide-react";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const { data: related } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        {/* Hero image */}
        {post.featured_image && (
          <div className="w-full h-64 md:h-96 overflow-hidden bg-cream-200">
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft size={15} /> Back to Blog
          </Link>

          {/* Meta */}
          {post.category && (
            <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
          )}
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-4">
            {post.content?.split("\n").map((para: string, i: number) => (
              para.trim() ? <p key={i} className="text-base leading-relaxed text-foreground/90">{para}</p> : null
            ))}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="bg-accent text-muted-foreground text-xs px-3 py-1.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related posts */}
        {related && related.length > 0 && (
          <div className="border-t border-border bg-cream-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-playfair text-2xl font-bold mb-6">More from our blog</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`}
                    className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card-hover transition-all">
                    <div className="aspect-[16/9] bg-cream-200 overflow-hidden">
                      {p.featured_image
                        ? <img src={p.featured_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full bg-gradient-to-br from-brand-100 to-cream-200" />
                      }
                    </div>
                    <div className="p-4">
                      <h3 className="font-playfair font-bold text-base group-hover:text-brand-600 transition-colors line-clamp-2">{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
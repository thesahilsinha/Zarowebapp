import { createClient } from "@/lib/supabase/server";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import CategoriesSection from "@/components/home/CategoriesSection";
import BestSellersSection from "@/components/home/BestSellersSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import StatsSection from "@/components/home/StatsSection";
import HampersSection from "@/components/home/HampersSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: banners },
    { data: categories },
    { data: bestSellers },
    { data: hampers },
  ] = await Promise.all([
    supabase.from("hero_banners").select("*").eq("is_active", true).order("display_order"),
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("products").select("*").eq("is_best_seller", true).eq("is_active", true).limit(8),
    supabase.from("products").select("*").eq("is_active", true).eq("type", "regular").limit(8),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <CategoriesSection categories={categories || []} />
        <HeroSlider banners={banners || []} />
        <BestSellersSection products={bestSellers || []} />
        <ExperienceSection />
        <HampersSection products={hampers || []} />
        <ReviewsSection />
        <StatsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
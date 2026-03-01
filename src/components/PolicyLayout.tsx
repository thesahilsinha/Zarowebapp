import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PolicyLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <div className="bg-gradient-to-br from-brand-50 to-cream-100 py-12 px-4 text-center">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground text-sm">Last updated: {lastUpdated}</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl border border-border p-8 md:p-12 space-y-6
            [&_h2]:font-playfair [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-2
            [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:text-sm">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
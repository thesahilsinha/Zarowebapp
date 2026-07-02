import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GiftCardClient from "@/components/GiftCardClient";

export const metadata = { title: "Gift Cards | Zaro Bakehouse" };

export default function GiftCardsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <GiftCardClient />
      </main>
      <Footer />
    </div>
  );
}
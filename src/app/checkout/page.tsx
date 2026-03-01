import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata = { title: "Checkout | Zaro Bakehouse" };

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        <CheckoutClient />
      </main>
      <Footer />
    </div>
  );
}
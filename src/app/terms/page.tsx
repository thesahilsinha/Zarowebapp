import PolicyLayout from "@/components/PolicyLayout";

export const metadata = { title: "Terms & Conditions | Zaro Bakehouse" };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="January 2025">
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using the Zaro Bakehouse website and services, you accept and agree to be bound by these Terms and Conditions.</p>

      <h2>2. Products & Orders</h2>
      <p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice.</p>

      <h2>3. Delivery</h2>
      <p>We deliver within selected pincodes in Mumbai. Delivery charges and timelines vary by location. Same-day delivery is available for Freshly Baked items ordered before 2 PM.</p>

      <h2>4. Payment</h2>
      <p>We accept Cash on Delivery and online payments via Razorpay. All prices are in Indian Rupees (INR) and inclusive of applicable taxes.</p>

      <h2>5. Cancellations</h2>
      <p>Orders can be cancelled before they are dispatched. Once dispatched, cancellations are not accepted. Please contact us at zarobakerhouse@gmail.com for assistance.</p>

      <h2>6. Limitation of Liability</h2>
      <p>Zaro Bakehouse shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>

      <h2>7. Contact</h2>
      <p>For any questions regarding these terms, please contact us at zarobakerhouse@gmail.com or call +91 98201 53592.</p>
    </PolicyLayout>
  );
}
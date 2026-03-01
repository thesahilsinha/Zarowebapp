import PolicyLayout from "@/components/PolicyLayout";

export const metadata = { title: "Payment Policy | Zaro Bakehouse" };

export default function PaymentPolicyPage() {
  return (
    <PolicyLayout title="Payment Policy" lastUpdated="January 2025">
      <h2>Payment Methods</h2>
      <p>We accept Cash on Delivery (COD) for all orders. Online payment via Razorpay (UPI, Credit/Debit Cards, Net Banking) is available and will be enabled soon.</p>

      <h2>Cash on Delivery</h2>
      <p>COD is available for all delivery locations. Please keep exact change ready at the time of delivery. Our delivery partner will collect the payment.</p>

      <h2>Online Payments via Razorpay</h2>
      <p>When enabled, online payments are processed securely through Razorpay. We do not store your card or payment details on our servers.</p>

      <h2>Payment Security</h2>
      <p>All online transactions are secured with SSL encryption. Razorpay is PCI DSS compliant, ensuring your payment data is handled with the highest security standards.</p>

      <h2>Failed Payments</h2>
      <p>If your payment fails, the amount will be refunded to your account within 5-7 business days. Please contact us if you face any issues.</p>

      <h2>Contact</h2>
      <p>For payment related queries: zarobakerhouse@gmail.com | +91 98201 53592</p>
    </PolicyLayout>
  );
}
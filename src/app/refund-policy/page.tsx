import PolicyLayout from "@/components/PolicyLayout";

export const metadata = { title: "Refund Policy | Zaro Bakehouse" };

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy" lastUpdated="January 2025">
      <h2>Our Commitment</h2>
      <p>At Zaro Bakehouse, we take pride in the quality of our products. If you are not satisfied with your order, we want to make it right.</p>

      <h2>Eligibility for Refunds</h2>
      <p>Refunds are considered in the following cases: damaged or defective products, wrong items delivered, or significant quality issues. Claims must be raised within 24 hours of delivery.</p>

      <h2>How to Raise a Refund Request</h2>
      <p>Contact us at zarobakerhouse@gmail.com or raise a Help Desk ticket in your account within 24 hours of receiving your order. Include your order number and photos of the issue.</p>

      <h2>Refund Process</h2>
      <p>Once approved, refunds are processed within 5-7 business days to the original payment method. For Cash on Delivery orders, refunds are issued as store credit or bank transfer.</p>

      <h2>Non-Refundable Items</h2>
      <p>Freshly Baked items that have been delivered in good condition are non-refundable due to their perishable nature. Custom hampers are non-refundable once prepared.</p>

      <h2>Contact Us</h2>
      <p>Email: zarobakerhouse@gmail.com | Phone: +91 98201 53592</p>
    </PolicyLayout>
  );
}
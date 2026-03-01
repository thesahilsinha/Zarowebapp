import PolicyLayout from "@/components/PolicyLayout";

export const metadata = { title: "Privacy Policy | Zaro Bakehouse" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="January 2025">
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, including name, email address, phone number, and delivery address when you create an account or place an order.</p>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to process orders, send order confirmations, provide customer support, and improve our services. We do not sell your personal information to third parties.</p>

      <h2>Data Storage</h2>
      <p>Your data is stored securely using Supabase infrastructure with industry-standard encryption. We retain your data for as long as your account is active.</p>

      <h2>Cookies</h2>
      <p>We use cookies to maintain your session and improve your experience. You can disable cookies in your browser settings, though this may affect functionality.</p>

      <h2>Third-Party Services</h2>
      <p>We use Razorpay for payment processing. Their privacy policy applies to payment data. We use Resend for email delivery.</p>

      <h2>Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal data. Contact us at zarobakerhouse@gmail.com to exercise these rights.</p>

      <h2>Contact</h2>
      <p>For privacy concerns, contact us at zarobakerhouse@gmail.com</p>
    </PolicyLayout>
  );
}
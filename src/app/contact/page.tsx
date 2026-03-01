"use client";
import { useState } from "react";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />
      <main>
        {/* Hero */}
        <div className="bg-forest-800 text-white py-14 px-4 text-center">
          <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-2">Get in Touch</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/60 text-sm max-w-md mx-auto">Have a question, want to place a bulk order, or just want to say hello? We'd love to hear from you.</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Find Us</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: "Address",
                    value: "Shop No 10, Shiv Darshan, 33rd Road,\nBandra West, Mumbai 400050",
                  },
                  { icon: Phone, label: "Phone", value: "+91 98201 53592" },
                  { icon: Mail, label: "Email", value: "zarobakerhouse@gmail.com" },
                  { icon: Clock, label: "Hours", value: "Monday – Sunday: 8:00 AM – 8:00 PM" },
                  { icon: Instagram, label: "Instagram", value: "@zarobakehouse" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-sm text-foreground whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border h-56 bg-cream-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5928959095985!2d72.83160827495578!3d19.05882268215051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9587d0b3b3b%3A0x1234!2sBandra+West%2C+Mumbai!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-3xl border border-border p-8">
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-playfair font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help — bulk orders, custom hampers, feedback, or just a hello..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full bg-forest-800 hover:bg-forest-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    : "Send Message"
                  }
                </button>
                <p className="text-xs text-muted-foreground text-center">We typically respond within 24 hours.</p>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
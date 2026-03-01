import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const ZARO_EMAIL = process.env.ZARO_NOTIFY_EMAIL || "zarobakerhouse@gmail.com";

// ─── Order Confirmation to Customer ───────────────────────────────────────────
export async function sendOrderConfirmation(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  delivery_charge: number;
  discount: number;
  total: number;
  delivery_address: {
    full_name: string;
    address_line1: string;
    city: string;
    pincode: string;
    phone: string;
  };
  payment_method: string;
}) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0e8d8; font-size: 14px;">${item.name}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0e8d8; font-size: 14px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0e8d8; font-size: 14px; text-align: right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#F8F4ED;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(32,51,41,0.08);">

        <!-- Header -->
        <div style="background:#203329;padding:32px 40px;text-align:center;">
          <h1 style="color:white;font-size:26px;margin:0;letter-spacing:2px;font-weight:700;">ZARO BAKEHOUSE</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:6px 0 0;letter-spacing:1px;">BANDRA WEST, MUMBAI</p>
        </div>

        <!-- Body -->
        <div style="padding:40px;">
          <div style="background:#EA6D3A;color:white;text-align:center;padding:16px 24px;border-radius:12px;margin-bottom:28px;">
            <p style="margin:0;font-size:13px;opacity:0.85;">Order Confirmed</p>
            <p style="margin:6px 0 0;font-size:22px;font-weight:700;letter-spacing:1px;">#${order.order_number}</p>
          </div>

          <p style="font-size:16px;color:#203329;margin:0 0 6px;">Hi ${order.customer_name},</p>
          <p style="font-size:14px;color:#5a7065;line-height:1.6;margin:0 0 28px;">
            Thank you for your order! We've received it and will start preparing your bakes soon. You'll get another update when your order is out for delivery.
          </p>

          <!-- Items -->
          <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#5a7065;margin:0 0 12px;">Your Order</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left;font-size:11px;text-transform:uppercase;color:#5a7065;padding-bottom:8px;border-bottom:2px solid #f0e8d8;">Item</th>
                <th style="text-align:center;font-size:11px;text-transform:uppercase;color:#5a7065;padding-bottom:8px;border-bottom:2px solid #f0e8d8;">Qty</th>
                <th style="text-align:right;font-size:11px;text-transform:uppercase;color:#5a7065;padding-bottom:8px;border-bottom:2px solid #f0e8d8;">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <!-- Totals -->
          <div style="margin-top:16px;padding-top:16px;">
            <div style="display:flex;justify-content:space-between;font-size:13px;color:#5a7065;margin-bottom:6px;">
              <span>Subtotal</span><span>₹${order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px;color:#5a7065;margin-bottom:6px;">
              <span>Delivery</span><span>${order.delivery_charge === 0 ? "Free" : "₹" + order.delivery_charge}</span>
            </div>
            ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#EA6D3A;margin-bottom:6px;"><span>Discount</span><span>-₹${order.discount.toLocaleString("en-IN")}</span></div>` : ""}
            <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:700;color:#203329;margin-top:10px;padding-top:10px;border-top:2px solid #f0e8d8;">
              <span>Total</span><span>₹${order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <!-- Address -->
          <div style="background:#F8F4ED;border-radius:12px;padding:20px;margin-top:28px;">
            <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#5a7065;margin:0 0 10px;">Delivery Address</h3>
            <p style="font-size:14px;color:#203329;margin:0;line-height:1.7;">
              ${order.delivery_address.full_name}<br/>
              ${order.delivery_address.address_line1}<br/>
              ${order.delivery_address.city} — ${order.delivery_address.pincode}<br/>
              ${order.delivery_address.phone}
            </p>
          </div>

          <!-- Payment -->
          <div style="margin-top:16px;background:#F8F4ED;border-radius:12px;padding:16px 20px;">
            <p style="font-size:13px;color:#5a7065;margin:0;">Payment Method: <strong style="color:#203329;">${order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</strong></p>
          </div>

          <p style="font-size:13px;color:#5a7065;margin-top:28px;line-height:1.7;">
            Questions? Reply to this email or reach us at <a href="mailto:zarobakerhouse@gmail.com" style="color:#EA6D3A;">zarobakerhouse@gmail.com</a> or call <a href="tel:+919820153592" style="color:#EA6D3A;">+91 98201 53592</a>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#203329;padding:24px 40px;text-align:center;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">© 2025 Zaro Bakehouse · Shop No 10, Shiv Darshan, 33rd Road, Bandra West, Mumbai</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM,
    to: order.customer_email,
    subject: `Order Confirmed #${order.order_number} — Zaro Bakehouse`,
    html,
  });
}

// ─── Order Status Update to Customer ──────────────────────────────────────────
export async function sendOrderStatusUpdate(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total: number;
}) {
  const STATUS_MESSAGES: Record<string, { subject: string; heading: string; message: string; color: string }> = {
    confirmed: {
      subject: "Your order is confirmed",
      heading: "Order Confirmed",
      message: "Great news! Your order has been confirmed and we're getting started on your bakes.",
      color: "#3b82f6",
    },
    dispatched: {
      subject: "Your order has been dispatched",
      heading: "On Its Way",
      message: "Your order has been dispatched and is on its way to you. Get ready for fresh bakes!",
      color: "#8b5cf6",
    },
    out_for_delivery: {
      subject: "Your order is out for delivery",
      heading: "Out for Delivery",
      message: "Your order is out for delivery and will reach you shortly. Please keep your phone handy.",
      color: "#f97316",
    },
    delivered: {
      subject: "Your order has been delivered",
      heading: "Delivered",
      message: "Your order has been delivered. We hope you enjoy every bite! Don't forget to leave us a review.",
      color: "#22c55e",
    },
    cancelled: {
      subject: "Your order has been cancelled",
      heading: "Order Cancelled",
      message: "Your order has been cancelled. If you have any questions, please reach out to us.",
      color: "#ef4444",
    },
  };

  const config = STATUS_MESSAGES[order.status];
  if (!config) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F8F4ED;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(32,51,41,0.08);">
        <div style="background:#203329;padding:32px 40px;text-align:center;">
          <h1 style="color:white;font-size:26px;margin:0;letter-spacing:2px;font-weight:700;">ZARO BAKEHOUSE</h1>
        </div>
        <div style="padding:40px;">
          <div style="background:${config.color};color:white;text-align:center;padding:20px 24px;border-radius:12px;margin-bottom:28px;">
            <p style="margin:0;font-size:20px;font-weight:700;">${config.heading}</p>
            <p style="margin:6px 0 0;font-size:13px;opacity:0.85;">Order #${order.order_number}</p>
          </div>
          <p style="font-size:16px;color:#203329;margin:0 0 8px;">Hi ${order.customer_name},</p>
          <p style="font-size:14px;color:#5a7065;line-height:1.7;margin:0 0 24px;">${config.message}</p>
          <div style="background:#F8F4ED;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <p style="font-size:13px;color:#5a7065;margin:0;">Order Total: <strong style="color:#203329;">₹${order.total.toLocaleString("en-IN")}</strong></p>
          </div>
          <p style="font-size:13px;color:#5a7065;line-height:1.7;">
            Questions? <a href="mailto:zarobakerhouse@gmail.com" style="color:#EA6D3A;">zarobakerhouse@gmail.com</a> · <a href="tel:+919820153592" style="color:#EA6D3A;">+91 98201 53592</a>
          </p>
        </div>
        <div style="background:#203329;padding:24px 40px;text-align:center;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">© 2025 Zaro Bakehouse · Bandra West, Mumbai</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM,
    to: order.customer_email,
    subject: `${config.subject} — #${order.order_number} | Zaro Bakehouse`,
    html,
  });
}

// ─── New Order Notification to Zaro ───────────────────────────────────────────
export async function sendNewOrderNotification(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  payment_method: string;
  delivery_address: {
    full_name: string;
    address_line1: string;
    city: string;
    pincode: string;
    phone: string;
  };
}) {
  const itemsList = order.items
    .map((i) => `${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString("en-IN")}`)
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F8F4ED;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(32,51,41,0.08);">
        <div style="background:#EA6D3A;padding:24px 40px;text-align:center;">
          <h1 style="color:white;font-size:20px;margin:0;font-weight:700;">New Order Received!</h1>
          <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:6px 0 0;">Order #${order.order_number} · ₹${order.total.toLocaleString("en-IN")}</p>
        </div>
        <div style="padding:32px 40px;">
          <h3 style="font-size:13px;text-transform:uppercase;color:#5a7065;letter-spacing:1px;margin:0 0 12px;">Customer</h3>
          <p style="font-size:14px;color:#203329;margin:0 0 4px;font-weight:600;">${order.customer_name}</p>
          <p style="font-size:13px;color:#5a7065;margin:0 0 2px;">${order.customer_email}</p>
          <p style="font-size:13px;color:#5a7065;margin:0 0 24px;">${order.customer_phone || ""}</p>

          <h3 style="font-size:13px;text-transform:uppercase;color:#5a7065;letter-spacing:1px;margin:0 0 12px;">Items</h3>
          <div style="background:#F8F4ED;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <pre style="font-size:13px;color:#203329;margin:0;white-space:pre-wrap;font-family:inherit;line-height:1.8;">${itemsList}</pre>
          </div>

          <h3 style="font-size:13px;text-transform:uppercase;color:#5a7065;letter-spacing:1px;margin:0 0 12px;">Delivery Address</h3>
          <div style="background:#F8F4ED;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <p style="font-size:14px;color:#203329;margin:0;line-height:1.8;">
              ${order.delivery_address.full_name}<br/>
              ${order.delivery_address.address_line1}<br/>
              ${order.delivery_address.city} — ${order.delivery_address.pincode}<br/>
              ${order.delivery_address.phone}
            </p>
          </div>

          <p style="font-size:13px;color:#5a7065;margin:0;">Payment: <strong style="color:#203329;">${order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</strong></p>

          <div style="margin-top:24px;text-align:center;">
            <a href="https://zarobakehouse.com/admin/orders" style="background:#203329;color:white;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;">
              View in Admin Panel
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM,
    to: ZARO_EMAIL,
    subject: `New Order #${order.order_number} — ₹${order.total.toLocaleString("en-IN")}`,
    html,
  });
}
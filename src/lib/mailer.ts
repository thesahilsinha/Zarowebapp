import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BASE_STYLE = `
  <style>
    body { margin:0; padding:0; background:#F8F4ED; font-family:'Helvetica Neue',Arial,sans-serif; }
    .wrap { max-width:580px; margin:32px auto; background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 4px 24px rgba(32,51,41,0.08); }
    .header { background:#203329; padding:32px 40px; text-align:center; }
    .header h1 { color:#fff; font-size:24px; margin:0; letter-spacing:3px; font-weight:700; }
    .header p { color:rgba(255,255,255,0.5); font-size:11px; margin:6px 0 0; letter-spacing:2px; }
    .badge { margin:0 40px 0; background:#EA6D3A; color:#fff; text-align:center; padding:18px 24px; border-radius:0 0 16px 16px; }
    .badge p { margin:0; font-size:12px; opacity:.85; }
    .badge h2 { margin:4px 0 0; font-size:20px; font-weight:700; letter-spacing:1px; }
    .body { padding:36px 40px; }
    .body p { font-size:14px; color:#5a7065; line-height:1.7; margin:0 0 16px; }
    .body h3 { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#5a7065; margin:0 0 10px; }
    table { width:100%; border-collapse:collapse; }
    th { text-align:left; font-size:10px; text-transform:uppercase; color:#5a7065; padding-bottom:8px; border-bottom:2px solid #f0e8d8; }
    td { padding:10px 0; border-bottom:1px solid #f0e8d8; font-size:13px; color:#203329; }
    .box { background:#F8F4ED; border-radius:12px; padding:18px 20px; margin:16px 0; }
    .box p { margin:0; font-size:13px; color:#5a7065; line-height:1.8; }
    .total-row { display:flex; justify-content:space-between; font-size:13px; color:#5a7065; margin-bottom:6px; }
    .total-final { font-size:16px; font-weight:700; color:#203329; margin-top:10px; padding-top:10px; border-top:2px solid #f0e8d8; }
    .footer { background:#203329; padding:20px 40px; text-align:center; }
    .footer p { color:rgba(255,255,255,0.4); font-size:11px; margin:0; line-height:1.8; }
    a { color:#EA6D3A; }
  </style>
`;

function buildOrderTable(items: any[]) {
  return `
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center">Qty</th>
          <th style="text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td>${i.name}</td>
            <td style="text-align:center">${i.quantity}</td>
            <td style="text-align:right">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function buildTotals(subtotal: number, delivery: number, discount: number, giftCard: number, total: number) {
  return `
    <div style="margin-top:16px">
      <div class="total-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString("en-IN")}</span></div>
      <div class="total-row"><span>Delivery</span><span>${delivery === 0 ? "Free" : "₹" + delivery}</span></div>
      ${discount > 0 ? `<div class="total-row" style="color:#EA6D3A"><span>Coupon Discount</span><span>-₹${discount.toLocaleString("en-IN")}</span></div>` : ""}
      ${giftCard > 0 ? `<div class="total-row" style="color:#EA6D3A"><span>Gift Card</span><span>-₹${giftCard.toLocaleString("en-IN")}</span></div>` : ""}
      <div class="total-row total-final"><span>Total</span><span>₹${total.toLocaleString("en-IN")}</span></div>
    </div>
  `;
}

function buildAddress(addr: any) {
  return `
    <div class="box">
      <p>
        <strong>${addr.full_name}</strong><br/>
        ${addr.address_line1}${addr.address_line2 ? ", " + addr.address_line2 : ""}<br/>
        ${addr.city} — ${addr.pincode}<br/>
        ${addr.phone}
      </p>
    </div>
  `;
}

function buildFooter() {
  return `
    <div class="footer">
      <p>© ${new Date().getFullYear()} Zaro Bakehouse<br/>
      Shop No 10, Shiv Darshan, 33rd Road, Bandra West, Mumbai 400050<br/>
      <a href="mailto:zarobakerhouse@gmail.com" style="color:#EA6D3A">zarobakerhouse@gmail.com</a> · +91 98201 53592</p>
    </div>
  `;
}

// ── ORDER PLACED ────────────────────────────────────────────────
export async function sendOrderPlaced(order: any) {
  const html = `<!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="wrap">
      <div class="header">
        <h1>ZARO BAKEHOUSE</h1>
        <p>BANDRA WEST · MUMBAI</p>
      </div>
      <div class="badge">
        <p>Order Placed Successfully</p>
        <h2>#${order.order_number}</h2>
      </div>
      <div class="body">
        <p>Hi <strong>${order.customer_name}</strong>,</p>
        <p>Thank you for your order! We've received it and will confirm it shortly. You'll get another update as soon as we start preparing your order.</p>
        <h3>Your Order</h3>
        ${buildOrderTable(order.items)}
        ${buildTotals(order.subtotal, order.delivery_charge, order.discount, order.gift_card_discount || 0, order.total)}
        ${order.special_requests ? `<div class="box" style="margin-top:16px"><p><strong>Special Requests:</strong><br/>${order.special_requests}</p></div>` : ""}
        <h3 style="margin-top:24px">Delivery Address</h3>
        ${buildAddress(order.delivery_address)}
        <div class="box">
          <p>Payment: <strong>${order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</strong></p>
        </div>
        <p style="margin-top:24px">Questions? <a href="mailto:zarobakerhouse@gmail.com">zarobakerhouse@gmail.com</a> · <a href="tel:+919820153592">+91 98201 53592</a></p>
      </div>
      ${buildFooter()}
    </div>
  </body></html>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: order.customer_email,
    subject: `Order Placed #${order.order_number} — Zaro Bakehouse`,
    html,
  });

  // Notify Zaro
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: "zarobakerhouse@gmail.com",
    subject: `New Order #${order.order_number} — ₹${order.total}`,
    html: `<!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
      <div class="wrap">
        <div class="header"><h1>NEW ORDER</h1></div>
        <div class="badge" style="background:#22c55e"><p>Order Received</p><h2>#${order.order_number} · ₹${order.total}</h2></div>
        <div class="body">
          <h3>Customer</h3>
          <div class="box"><p><strong>${order.customer_name}</strong><br/>${order.customer_email}<br/>${order.delivery_address?.phone || ""}</p></div>
          <h3>Items</h3>
          ${buildOrderTable(order.items)}
          ${buildTotals(order.subtotal, order.delivery_charge, order.discount, order.gift_card_discount || 0, order.total)}
          ${order.special_requests ? `<div class="box" style="margin-top:16px"><p><strong>Special Requests:</strong><br/>${order.special_requests}</p></div>` : ""}
          <h3 style="margin-top:24px">Delivery Address</h3>
          ${buildAddress(order.delivery_address)}
          <div class="box"><p>Payment: <strong>${order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</strong></p></div>
          <div style="text-align:center;margin-top:24px">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders" style="background:#203329;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;display:inline-block">View in Admin Panel</a>
          </div>
        </div>
        ${buildFooter()}
      </div>
    </body></html>`,
  });
}

// ── STATUS UPDATE ────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; message: string; color: string }> = {
  confirmed: {
    label: "Order Confirmed",
    message: "Great news! Your order has been confirmed and we're getting started on your bakes.",
    color: "#3b82f6",
  },
  dispatched: {
    label: "Order Dispatched",
    message: "Your order is on its way! Our delivery partner has picked it up and it's heading to you.",
    color: "#8b5cf6",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    message: "Your order is out for delivery and will reach you shortly. Please keep your phone handy.",
    color: "#f97316",
  },
  delivered: {
    label: "Order Delivered",
    message: "Your order has been delivered! We hope you enjoy every bite. Don't forget to share your experience with us.",
    color: "#22c55e",
  },
  cancelled: {
    label: "Order Cancelled",
    message: "Your order has been cancelled. If you have any questions or need help, please reach out to us.",
    color: "#ef4444",
  },
};

export async function sendOrderStatusUpdate(order: any) {
  const config = STATUS_CONFIG[order.status];
  if (!config) return;

  const html = `<!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="wrap">
      <div class="header"><h1>ZARO BAKEHOUSE</h1><p>BANDRA WEST · MUMBAI</p></div>
      <div class="badge" style="background:${config.color}">
        <p>Order Update</p>
        <h2>${config.label}</h2>
      </div>
      <div class="body">
        <p>Hi <strong>${order.customer_name}</strong>,</p>
        <p>${config.message}</p>
        <div class="box">
          <p>Order Number: <strong>#${order.order_number}</strong><br/>
          Order Total: <strong>₹${order.total.toLocaleString("en-IN")}</strong></p>
        </div>
        <h3 style="margin-top:24px">Your Order</h3>
        ${buildOrderTable(order.items)}
        <p style="margin-top:24px">Questions? <a href="mailto:zarobakerhouse@gmail.com">zarobakerhouse@gmail.com</a> · <a href="tel:+919820153592">+91 98201 53592</a></p>
      </div>
      ${buildFooter()}
    </div>
  </body></html>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: order.customer_email,
    subject: `${config.label} — #${order.order_number} | Zaro Bakehouse`,
    html,
  });
}
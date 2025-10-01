// services/mailer.js
import nodemailer from 'nodemailer';

export function makeTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });
}

// -- helpers
const IN_OWNER = process.env.OWNER_EMAIL || 'info@kiddieskingdom.co.in';
const fmtINR = (p = 0) => {
  const rs = Math.round(Number(p) || 0) / 100;
  const s = Math.trunc(rs).toString();
  const last3 = s.slice(-3);
  const other = s.slice(0, -3);
  const withCommas = other ? other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return `₹${withCommas}`;
};

// customer
export async function sendOrderEmail({ to, orderId, attachmentPath }) {
  if (!to) return;
  const transporter = makeTransport();
  await transporter.sendMail({
    from: `"Kiddies Kingdom" <${process.env.SMTP_USER}>`,
    to,
    subject: `Order Confirmation ${orderId}`,
    text: `Thank you! Your order ${orderId} is confirmed.`,
    attachments: attachmentPath ? [{ filename: 'invoice.pdf', path: attachmentPath }] : []
  });
}

// owner (plain text summary; attachment optional)
export async function sendOwnerEmail({ order, attachmentPath }) {
  const transporter = makeTransport();

  // include variant color if present
  const lines = (order.items || [])
    .map(it => {
      const title = it.colorSnap ? `${it.titleSnap} (Color: ${it.colorSnap})` : `${it.titleSnap}`;
      const lineTotal = (it.pricePaiseSnap || 0) * (it.qty || 0);
      return `• ${title} × ${it.qty} = ${fmtINR(lineTotal)}`;
    })
    .join('\n');

  const addr = order.shipping || order.billing || {};

  // add personalisation line if present
  const personalizationBlock = order.personalisation && order.personalisation.trim()
    ? `\nPersonalisation: “${order.personalisation.trim()}” (+₹50)\n`
    : '';

  const body = `New order received.

Order ID: ${order._id}
Status: ${order.status}
Amount: ${fmtINR(order.amountPaise)}
Razorpay:
  Order: ${order.razorpayOrderId || 'N/A'}
  Payment: ${order.razorpayPaymentId || 'N/A'}

Customer:
  ${addr.name || '-'}
  ${addr.email || '-'}  |  ${addr.phone || '-'}

Address:
  ${[addr.line1, addr.line2].filter(Boolean).join(', ')}
  ${[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}

Items:
${lines || '(no items)'}${personalizationBlock}
`;

  await transporter.sendMail({
    from: `"Kiddies Kingdom" <${process.env.SMTP_USER}>`,
    to: IN_OWNER,
    subject: `🛒 New Order - ${order._id}`,
    text: body,
    attachments: attachmentPath ? [{ filename: 'invoice.pdf', path: attachmentPath }] : []
  });
}

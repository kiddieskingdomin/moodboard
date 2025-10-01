// services/invoice.js
import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

function inr(paise = 0) {
  const rs = Math.round(paise) / 100;
  return `₹${rs.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function generateInvoicePDF(order) {
  const dir = path.join(process.cwd(), 'invoices');
  ensureDir(dir);
  const file = path.join(dir, `${order._id}.pdf`);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 36 });
    const stream = fs.createWriteStream(file);
    doc.pipe(stream);

    // Header
    doc
      .fillColor('#ef927d').fontSize(26).text('Kiddies Kingdom', { align: 'center' })
      .moveDown(0.2)
      .fillColor('#555').fontSize(12).text('Where imagination meets play!', { align: 'center' })
      .moveDown(1.2);

    // Meta
    doc.fillColor('#000').fontSize(12);
    doc.text(`Invoice Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Razorpay Order ID: ${order.razorpayOrderId || 'N/A'}`);
    doc.text(`Payment ID: ${order.razorpayPaymentId || 'N/A'}`);
    doc.moveDown();

    // Address block
    doc.fontSize(16).fillColor('#000').text('Billing / Shipping Address', { underline: true });
    doc.moveDown(0.3).fontSize(12);
    const a = order.billing || order.shipping || {};
    doc.text(a.name || '');
    doc.text(a.email || '');
    doc.text(a.phone || '');
    doc.text([a.line1, a.line2].filter(Boolean).join(', '));
    doc.text([a.city, a.state, a.pincode].filter(Boolean).join(', '));
    doc.moveDown();

    // Items
    doc.fontSize(16).text('Order Items', { underline: true }).moveDown(0.3);
    doc.moveTo(36, doc.y).lineTo(559, doc.y).strokeColor('#999').stroke();
    doc.moveDown(0.6);

    (order.items || []).forEach((it) => {
      const itemPrice = it.pricePaiseSnap || 0;
      const quantity = it.qty || 1;
      const lineTotal = itemPrice * quantity;
      
      // Title + color if present
      let lineTitle = it.titleSnap || 'Item';
      if (it.colorSnap) {
        lineTitle += ` (Color: ${it.colorSnap})`;
      }

      doc.fontSize(12).fillColor('#000')
        .text(lineTitle, { continued: true })
        .text('   ', { continued: true })
        .fillColor('#555')
        .text(`${inr(itemPrice)} × ${quantity}`, { continued: true })
        .fillColor('#000')
        .text(`   =  ${inr(lineTotal)}`, { align: 'right' });
    });

    // Personalisation line if present
    if (order.personalisation && order.personalisation.trim()) {
      doc.moveDown(0.3);
      const charge = 5000; // fixed ₹50 in paise
      doc.fontSize(12).fillColor('#000')
        .text(`Personalisation: “${order.personalisation.trim()}”`, { continued: true })
        .fillColor('#555')
        .text(`(+${inr(charge)})`, { align: 'right' });
    }

    doc.moveDown(0.6);
    doc.moveTo(36, doc.y).lineTo(559, doc.y).strokeColor('#999').stroke();

    // Total
    doc.moveDown(0.6);
    doc.fontSize(14).fillColor('#000')
      .text(`Total Amount: ${inr(order.amountPaise || 0)}`, { align: 'right' });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor('#666')
      .text('Thank you for shopping with Kiddies Kingdom!', { align: 'center' })
      .text('For support, contact us at info@kiddieskingdom.co.in', { align: 'center' })
      .text('This invoice is computer generated and does not require a signature.', { align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return file;
}

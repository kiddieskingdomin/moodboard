// routes/checkout.js
import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import Cart from '../models/cart.js';
import Order from '../models/order.js';
import { generateInvoicePDF } from '../services/invoice.js';
import { sendOwnerEmail, sendOrderEmail } from '../services/mailer.js';

const router = express.Router();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ---- helpers ----
function computeSubtotalPaise(cart) {
  return cart.items.reduce((sum, it) =>
    sum + (it.pricePaiseSnap || 0) * (it.qty || 0), 0);
}

// same shipping rule as frontend:
// subtotal > ₹999 => free, else ~₹50 if there are items
function computeShippingPaise(subtotalPaise, hasItems) {
  return subtotalPaise > 99900 ? 0 : (hasItems ? 4999 : 0);
}

// normalize a cart line into an order line (explicitly keep color)
function toOrderItem(i) {
  const raw = i?.toObject?.() ? i.toObject() : i;
  return {
    productId: raw.productId,
    qty: raw.qty,
    titleSnap: raw.titleSnap,
    pricePaiseSnap: raw.pricePaiseSnap,
    imageSnap: raw.imageSnap,
    slugSnap: raw.slugSnap,
    // 👇 keep the selected variant color
    colorSnap: raw.colorSnap ?? null,
  };
}

/**
 * POST /api/checkout/start
 * body: {
 *   shipping: {...}, billing?: {...}, notes?: string,
 *   personalisation?: string  // optional, <=12 chars
 * }
 * resp: { ok, keyId, amountPaise, currency, razorpayOrderId, orderId }
 */
router.post('/start', async (req, res) => {
  const sid = req.sessionId;
  const cart = await Cart.findOne({ sessionId: sid });
  if (!cart || !cart.items.length) return res.status(400).json({ error: 'empty_cart' });

  const subtotalPaise = computeSubtotalPaise(cart);
  if (subtotalPaise < 100) return res.status(400).json({ error: 'min_amount_100' });

  const { shipping, billing, notes } = req.body || {};

  // accept both spellings from client, trim it
  const personalisationText = String(
    (req.body?.personalisation ?? req.body?.personalization ?? '')
  ).trim();

  if (personalisationText.length > 12) {
    return res.status(400).json({ error: 'personalisation_max_12' });
  }

  if (!shipping?.name || !shipping?.phone || !shipping?.email ||
      !shipping?.pincode || !shipping?.city || !shipping?.line1) {
    return res.status(400).json({ error: 'bad_address' });
  }

  const shippingPaise = computeShippingPaise(subtotalPaise, !!cart.items.length);
  const personalizationPaise = personalisationText ? 5000 : 0; // ₹50 if provided
  const taxPaise = 0; // add GST here if you ever need it

  const amountPaise = subtotalPaise + shippingPaise + taxPaise + personalizationPaise;

  const order = await Order.create({
    sessionId: sid,
    // 👇 explicitly map items so colorSnap survives
    items: cart.items.map(toOrderItem),
    amountPaise,
    status: 'created',
    shipping,
    billing: billing || shipping,
    notes: notes || '',
    personalisation: personalisationText, // save on order
  });

  // create Razorpay order on server-computed total
  const rOrder = await rzp.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `rcpt_${order._id}`,
    notes: {
      ...(notes ? { notes } : {}),
      orderId: String(order._id),
      personalisation: personalisationText || ''
    }
  });

  order.razorpayOrderId = rOrder.id;
  await order.save();

  res.json({
    ok: true,
    keyId: process.env.RAZORPAY_KEY_ID,
    amountPaise,
    currency: 'INR',
    razorpayOrderId: rOrder.id,
    orderId: String(order._id)
  });
});

/**
 * POST /api/checkout/verify
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, email? }
 */
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return res.status(400).json({ error: 'missing_fields' });

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(payload).digest('hex');

  if (expected !== razorpay_signature)
    return res.status(400).json({ error: 'signature_invalid' });

  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { status: 'paid', razorpayPaymentId: razorpay_payment_id },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'order_not_found' });

  await Cart.updateOne({ sessionId: order.sessionId }, { $set: { items: [] } });

  // invoice + emails (customer + owner)
  const invoicePath = await generateInvoicePDF(order);
  try {
    const toEmail = email || order.shipping?.email;
    if (toEmail) await sendOrderEmail({ to: toEmail, orderId: order._id, attachmentPath: invoicePath });
  } catch (e) { console.error('customer mail error', e); }

  try {
    await sendOwnerEmail({ order, attachmentPath: invoicePath }); // 👈 owner alert
  } catch (e) { console.error('owner mail error', e); }

  res.json({ ok: true, orderId: String(order._id) });
});

// ---- webhook path ----
router.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (secret) {
      const expected = crypto.createHmac('sha256', secret)
        .update(req.body).digest('hex');
      if (expected !== signature) return res.status(400).json({ error: 'bad_webhook_sig' });
    }
    const event = JSON.parse(req.body.toString());
    if (event.event === 'payment.captured') {
      const p = event.payload.payment.entity;
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: p.order_id },
        { status: 'paid', razorpayPaymentId: p.id },
        { new: true }
      );
      if (order) {
        const invoicePath = await generateInvoicePDF(order);
        // customer
        try {
          const toEmail = order.shipping?.email;
          if (toEmail) await sendOrderEmail({ to: toEmail, orderId: order._id, attachmentPath: invoicePath });
        } catch (e) { console.error('customer mail error', e); }
        // owner
        try {
          await sendOwnerEmail({ order, attachmentPath: invoicePath });
        } catch (e) { console.error('owner mail error', e); }
      }
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('webhook error', e);
    res.status(400).json({ error: 'webhook_error' });
  }
});

/**
 * GET /api/checkout/orders/:id
 */
router.get('/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ error: 'order_not_found' });
  res.json(order);
});

/**
 * GET /api/checkout/orders/:id/invoice
 */
router.get('/orders/:id/invoice', async (req, res) => {
  const file = path.join(process.cwd(), 'invoices', `${req.params.id}.pdf`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'invoice_not_found' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${req.params.id}.pdf"`);
  fs.createReadStream(file).pipe(res);
});

export default router;

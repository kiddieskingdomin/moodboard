import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import Cart from '../models/cart.js';
import Order from '../models/Order.js';
import { getById } from '../utils/catelog.js';

const router = express.Router();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Util: compute amount from cart snapshots
function computeAmountPaise(cart) {
  let total = 0;
  for (const it of cart.items) total += (it.pricePaiseSnap || 0) * it.qty;
  return total;
}

/**
 * Step A: Create Razorpay order from current cart
 * POST /api/payment/create-order
 * body: { notes?: object }  // optional notes
 * resp: { keyId, razorpayOrderId, amountPaise, currency }
 */
router.post('/create-order', async (req, res) => {
  const sid = req.sessionId;
  const cart = await Cart.findOne({ sessionId: sid });
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'empty_cart' });

  const amountPaise = computeAmountPaise(cart);
  if (amountPaise < 100) return res.status(400).json({ error: 'min_amount_100' });

  // Create or reuse a DB order for this session (one at a time)
  const dbOrder = await Order.create({
    sessionId: sid,
    items: cart.items.map(i => ({ ...i.toObject?.() || i })),
    amountPaise,
    status: 'created'
  });

  const rOrder = await rzp.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `rcpt_${dbOrder._id}`,
    notes: req.body?.notes || {}
  });

  dbOrder.razorpayOrderId = rOrder.id;
  await dbOrder.save();

  res.json({
    keyId: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: rOrder.id,
    amountPaise,
    currency: 'INR',
    orderId: String(dbOrder._id) // your DB id (useful on client)
  });
});

/**
 * Step B: Verify after client success
 * POST /api/payment/verify
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  // Signature check
  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                         .update(payload).digest('hex');

  const valid = expected === razorpay_signature;
  if (!valid) return res.status(400).json({ error: 'signature_invalid' });

  // Mark DB order paid
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { status: 'paid', razorpayPaymentId: razorpay_payment_id },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'order_not_found' });

  // Optional: clear cart now that it's paid
  await Cart.updateOne({ sessionId: order.sessionId }, { $set: { items: [] } });

  res.json({ ok: true, orderId: String(order._id) });
});

/**
 * Optional Step C: Webhook safety net
 * Set webhook secret in Razorpay dashboard and compare header
 */
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
      await Order.updateOne(
        { razorpayOrderId: p.order_id },
        { $set: { status: 'paid', razorpayPaymentId: p.id } }
      );
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('webhook error', e);
    res.status(400).json({ error: 'webhook_error' });
  }
});

export default router;

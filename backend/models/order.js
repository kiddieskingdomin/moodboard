import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  items: [{
    productId: String,
    qty: Number,
    titleSnap: String,
    pricePaiseSnap: Number
  }],
  amountPaise: { type: Number, required: true, min: 100 },
  status: { type: String, enum: ['created','paid','failed','cod'], default: 'created', index: true },
  razorpayOrderId: String,
  razorpayPaymentId: String
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);

// models/Order.js
import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
}, { _id: false });

const ItemSchema = new mongoose.Schema({
  productId: String,
  qty: Number,
  titleSnap: String,
  pricePaiseSnap: Number,
  imageSnap: String,
  slugSnap: String,
  colorSnap: String,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  items: { type: [ItemSchema], default: [] },
  amountPaise: { type: Number, required: true, min: 100 },
  status: { type: String, enum: ['created', 'paid', 'failed', 'cod'], default: 'created', index: true },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  shipping: AddressSchema,
  billing: AddressSchema,
  notes: String,
  personalisation: { type: String, maxlength: 12, default: "" },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);

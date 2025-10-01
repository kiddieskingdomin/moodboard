// models/cart.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  qty: { type: Number, required: true, min: 1, max: 10, default: 1 },

  // snapshots to render even if catalog changes
  titleSnap: String,
  pricePaiseSnap: { type: Number, min: 0 },
  imageSnap: String,
  slugSnap: String,

  // 👇 new field for selected color variant
  colorSnap: String  // example: "Wedding White", "Blue Heaven", etc.
}, { _id: false });

const CartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  items: { type: [CartItemSchema], default: [] },

  // optional soft TTL
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 14*24*3600*1000), 
    index: { expires: '0s' } 
  }
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);

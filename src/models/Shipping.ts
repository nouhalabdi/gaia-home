import mongoose from 'mongoose';

const ShippingSchema = new mongoose.Schema({
  wilaya: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  homePrice: { type: Number, default: 0 },
  officePrice: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Shipping || mongoose.model('Shipping', ShippingSchema);
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // معلومات العميل
  customerName: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String, required: true },

  // معلومات العنوان
  wilaya: { type: String },
  wilayaCode: { type: String },
  commune: { type: String },
  address: { type: String, required: true },

  // معلومات التوصيل
  deliveryType: { type: String, enum: ['home', 'office'], default: 'home' },

  // المنتجات والأسعار
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  subtotal: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },

  // الحالة
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    gateway: { type: String, default: 'khalti' },
    pidx: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    status: { type: String, default: 'pending' },
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    payment: { type: paymentSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);

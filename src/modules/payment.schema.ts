import e from 'express';
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: true,
    },
    amount: {
      type: Number,
      ref: 'Cart',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      required: true,
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;

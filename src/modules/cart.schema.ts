import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, default: 1, min: 1, required: true },
        size: { type: String, default: '', required: true },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.models.cart || mongoose.model('Cart', cartSchema);
export default Cart;

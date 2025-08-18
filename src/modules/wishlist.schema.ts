import mongoose from 'mongoose';

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

const WishList =
  mongoose.models.wishList || mongoose.model('WishList', wishListSchema);
export default WishList;

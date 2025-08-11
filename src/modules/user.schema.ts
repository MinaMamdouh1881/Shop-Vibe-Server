import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    salt: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    userName: { type: String, required: true },
    rule: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    myFavorites: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'products', default: [] },
    ],
    myCart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: { type: Number, default: 1, min: 1, required: true },
        size: { type: String, default: '', required: true },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

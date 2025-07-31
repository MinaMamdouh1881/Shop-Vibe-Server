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
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] },
    ],
    myCart: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

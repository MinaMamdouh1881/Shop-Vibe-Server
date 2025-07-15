import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    salt: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    userName: { type: String, required: true },
    rule: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   userName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   salt: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   rule: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const User = mongoose.models.User || mongoose.model('User', userSchema);
// export default User;

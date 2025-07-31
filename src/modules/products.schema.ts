import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['men', 'women'],
    required: true,
  },
  category: {
    type: String,
    enum: ['shoes', 'pants', 'shirt', 't-shirt', 'skirt', 'heels', 'blouse'],
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    required: true,
    default: false,
  },
  sales: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Products =
  mongoose.models.Products || mongoose.model('products', productSchema);

export default Products;

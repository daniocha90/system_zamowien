import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ean: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String,
    required: true
  },
  priceNet: {
    type: Number,
    required: true,
    min: 0
  },
  priceGross: {
    type: Number,
    required: true,
    min: 0
  },
  vatRate: {
    type: Number,
    required: true,
    default: 23
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
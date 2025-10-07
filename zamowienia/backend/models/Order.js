import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    company: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    shippingAddress: {
      type: String,
      required: true
    },
    nip: {
      type: String,
      required: true
    },
    nipValid: {
      type: Boolean,
      default: false
    },
    nipCheckedAt: {
      type: Date
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPriceNet: Number,
    unitPriceGross: Number,
    discount: Number
  }],
  totals: {
    net: Number,
    vat: Number,
    gross: Number,
    discount: Number
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

// Generate order number before save
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
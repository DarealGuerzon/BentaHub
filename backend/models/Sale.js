const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('Sale', saleSchema);

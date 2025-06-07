// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  dateAdded: { type: Date, default: Date.now },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);

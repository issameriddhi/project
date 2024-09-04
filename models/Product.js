const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // URL or file path for the image
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['clothing', 'accessories', 'sustainable'], 
    required: true 
  },
  seller: { type: String, ref: 'User', required: true }, // Link to seller
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

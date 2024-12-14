// models/saleModel.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    sellerId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;

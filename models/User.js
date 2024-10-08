const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seller', 'buyer', 'admin'], required: true }, // User role
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

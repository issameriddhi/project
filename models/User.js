const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  desc: { type: String },
  role: { type: String, enum: ['seller', 'buyer', 'admin'], required: true }, // User role
  image: {type:String},
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken:{
    type:String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

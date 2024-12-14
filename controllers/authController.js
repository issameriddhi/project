const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here'; // Replace with a secure key



// Register a new user
exports.register = async (req, res) => {
  const { username, email, phoneNumber, country, password, role } = req.body;

  try {
    // Check for existing user by username, phone number, or email
    const existingUser1 = await User.findOne({ username });
    if (existingUser1) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }
    const existingUser2 = await User.findOne({ phoneNumber });
    if (existingUser2) {
      return res.status(400).json({ message: 'Phone number is already associated with another account.' });
    }
    const existingUser3 = await User.findOne({ email });
    if (existingUser3) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Validate role
    if (!['seller', 'buyer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified. Please choose a valid role.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ username, phoneNumber, email, country, password: hashedPassword, role });
    await newUser.save();

    // Send confirmation email after successful registration
    try {
      await sendConfirmationEmail(email, username);
    } catch (emailError) {
      console.error('Registration successful but error sending email:', emailError.message);
      // Registration success, even if email fails
    }

    res.status(201).json({ message: 'User registered successfully and confirmation email sent.' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Log successful login
    console.log(`User logged in: ${user.username}`);

    // Respond with the token, role, and username
    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      username: user.username
    });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
};
exports.sendResetToken = async (req, res) => {
  const {username} = req.body;
  const resetToken = crypto.randomBytes(32).toString('hex');

  try{
    const user = await User.findOne({username})
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the reset token in the user's record
    user.resetPasswordToken = resetToken;
    console.log(user)
    // Optionally, set an expiry for the token if needed
    // user.resetPasswordTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Set up email transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or another service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create email
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you requested to reset your password.
      This is your reset password token: ${resetToken}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset email sent' });

  })
}
  catch(err){
    console.error(err)  
    res.status(500).json({message:err})
  }
};

exports.checkResetToken = async(req,res) => {
  try{
  const {resetToken} = req.body;
  const user = await User.findOne({resetPasswordToken:resetToken})
  if(!user){
    return res.status(401).json({ message: 'Invalid reset token' });
    }
    // If the token is valid, return the user's details
    res.status(200).json({ message: 'Reset token is valid', user });
  }
  catch(err){
    console.error('Error checking reset token:', err);
    res.status(500).json({message: err})
  }
}

exports.resetPassword = async (req,res) => {
  try{
  const {resetToken, newPassword} = req.body;
  const user = await User.findOne({resetPasswordToken:resetToken})
      if (!user) {
        return res.status(401).json({ message: 'Invalid reset token' });
        }
        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        // Update the user's password
        user.password = hashedPassword;
        user.resetPasswordToken = '';
        await user.save()
        res.status(200).json({ message: 'Password reset successfully' });
      }
    
    catch(err){
      console.error('Error resetting password:', err);
      res.status(500).json({message:err})
    }
  }
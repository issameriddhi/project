const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Configure Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any other email service like Yahoo, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address (or the sender's email)
    pass: process.env.EMAIL_PASS // App password if using Gmail, or your email password
  }
});

// Function to send email notification
const sendNotificationEmail = async (userEmail, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Your Profile Has Been Updated',
    text: `Dear ${username},\n\nYour profile information has been updated successfully.\n\nBest regards,\nNexusBloom Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Profile update notification email sent successfully.');
  } catch (error) {
    console.error('Error sending profile update notification email:', error);
    throw new Error('Error sending profile update notification email');
  }
};

// Fetch user data by username
exports.fetchUserData = async (req, res) => {
    try {
        const { username } = req.params; // Extract username from params
        const user = await User.findOne({ username }); // Query for user
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user); // Send user data
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
    }
};

// Update user data
exports.updateUserData = async (req, res) => {
    try {
        const { username } = req.params; // Extract username from params
        const { phoneNumber, email, country, desc } = req.body; // Extract data from body

        // Find the user to check if they exist
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update user data
        const result = await User.updateOne(
            { username }, // Query for user
            { phoneNumber, email, country, desc } // Update fields
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('User not found');
        }

        // Send notification email
        await sendNotificationEmail(email, username);

        res.status(200).send('User data updated successfully');
    } catch (err) {
        console.error('Error updating user data:', err);
        res.status(500).send('Error updating user data');
    }
};

// Optional: If updateUserProfile has different functionality, update accordingly
// If it does the same as updateUserData, you can remove it to avoid duplication
exports.updateUserProfile = async (req, res) => {
    try {
        const { username } = req.params; // Extract username from params
        const { phoneNumber, email, country, desc } = req.body; // Extract data from body

        // Find the user to check if they exist
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update user data
        const result = await User.updateOne(
            { username }, // Query for user
            { phoneNumber, email, country, desc } // Update fields
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('User not found');
        }

        // Send notification email
        await sendNotificationEmail(email, username);

        res.status(200).send('User profile updated successfully');
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).send('Error updating user profile');
    }
};

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const path = require('path');
const cors = require("cors");
const credentials = require('./middleware/credentials')
const corsOptions = require('./config/corsOptions')
const {verifyToken} = require('./middleware/authMiddleware')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(credentials)
app.use(cors(corsOptions))
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRoutes); // Use auth routes
// app.use(verifyToken);
app.use('/products', productRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

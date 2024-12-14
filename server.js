const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000 ;

// Apply credentials middleware before CORS
app.use(credentials);
app.use(cors(corsOptions));

// Middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Routes
app.use('/auth', authRoutes); // User authentication routes

// Uncomment if token verification is needed globally
// app.use(verifyToken);

app.use('/products', productRoutes); // Product-related routes
app.use('/api', orderRoutes); // Order-related routes
app.use('/user', userRoutes); // User-related routes


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

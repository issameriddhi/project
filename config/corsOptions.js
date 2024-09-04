// config/corsOptions.js
const allowedOrigins = [
    'http://localhost:3000',  // Replace with your frontend URL
    'http://127.0.0.1:5500'   // Replace with your frontend URL
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
  module.exports = corsOptions;
  
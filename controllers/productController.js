const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');


// Set up the Multer middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');


// Controller function to create a new product with image upload
exports.createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image', error: err });
    }

    try {
      console.log(req.body)
      const { name, price, description, category,seller } = req.body;
      const image = req.file ? req.file.path : ''; // Store the image path

      // Assuming req.user._id contains the authenticated seller's info

      const newProduct = new Product({ name, image, price, description, category, seller });
      await newProduct.save();

      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
      console.log(error )
    }
  });
};

// Fetch all products with their image URLs
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Map products to include full image URL
    const productsWithImageURL = products.map(product => {
      return {
        ...product._doc,
        image: `${req.protocol}://${req.get('host')}/${product.image}` // Full image URL
      };
    });

    res.status(200).json(productsWithImageURL);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Fetch products by category with their image URLs
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    // Map products to include full image URL
    const productsWithImageURL = products.map(product => {
      return {
        ...product._doc,
        image: `${req.protocol}://${req.get('host')}/${product.image}` // Full image URL
      };
    });

    res.status(200).json(productsWithImageURL);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error });
  }
};

// Fetch products by a specific seller with their image URLs
exports.getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ seller: sellerId });

    // Map products to include full image URL
    const productsWithImageURL = products.map(product => {
      return {
        ...product._doc,
        image: `${req.protocol}://${req.get('host')}/${product.image}` // Full image URL
      };
    });

    res.status(200).json(productsWithImageURL);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by seller', error });
  }
};


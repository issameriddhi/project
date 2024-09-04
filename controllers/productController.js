const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique file name
  }
});

// Set up the Multer middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
}).single('image'); // Accept a single file with the field name 'image'

// Controller function to create a new product with image upload
exports.createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image', error: err });
    }

    try {
      const { name, price, description, category } = req.body;
      const image = req.file ? req.file.path : ''; // Store the image path

      // Assuming req.user._id contains the authenticated seller's info
      const seller = req.user._id;

      const newProduct = new Product({ name, image, price, description, category, seller });
      await newProduct.save();

      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
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


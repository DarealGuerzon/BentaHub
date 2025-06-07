const Product = require('../models/Product');

// Get all products for the authenticated user
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    console.log('=== Add Product Request ===');
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    
    const { name, price, quantity } = req.body;
    
    if (!name || !price || !quantity) {
      console.log('Missing required fields:', { name, price, quantity });
      return res.status(400).json({ message: 'Name, price, and quantity are required' });
    }

    if (!req.user || !req.user.id) {
      console.log('No user ID found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Creating product with data:', {
      name,
      price,
      quantity,
      userId: req.user.id
    });

    const product = new Product({
      name,
      price,
      quantity,
      userId: req.user.id
    });

    console.log('Saving product to database...');
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error in addProduct:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    const product = await Product.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name) product.name = name;
    if (price != null) product.price = price;
    if (quantity != null) product.quantity = quantity;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
};

//add stock 
exports.addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { addedQuantity } = req.body;

    if (addedQuantity == null || addedQuantity <= 0) {
      return res.status(400).json({ message: 'Please provide a positive quantity to add' });
    }

    const product = await Product.findOne({ 
      _id: id,
      userId: req.user.id 
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.quantity += addedQuantity;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Add stock error:', error);
    res.status(500).json({ message: error.message });
  }
};

//reduce stock
exports.reduceStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null || quantity <= 0) {
      return res.status(400).json({ message: 'Please provide a valid product ID and quantity' });
    }

    const product = await Product.findOne({ 
      _id: productId,
      userId: req.user.id 
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    product.quantity -= quantity;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Reduce stock error:', error);
    res.status(500).json({ message: error.message });
  }
};

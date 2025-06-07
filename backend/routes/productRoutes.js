const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// RESTful routes
router.post('/', productController.addProduct);     // Create a new product
router.get('/', productController.getProducts);     // Get all products
router.get('/:id', productController.getProductById); // Get a specific product
router.put('/:id', productController.updateProduct);  // Update a product
router.delete('/:id', productController.deleteProduct); // Delete a product

// Stock management routes
router.put('/add-stock/:id', productController.addStock);    // Add stock to a product
router.post('/reduce', productController.reduceStock);       // Reduce stock for checkout

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

router.post('/add', productController.addProduct);  // call addProduct for adding a product
router.get('/', productController.getProducts);     // call getProducts to get all products

// Optionally add routes for other actions like update, delete, etc.
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
// Add stock to existing product
router.put('/add-stock/:id', productController.addStock);

module.exports = router;

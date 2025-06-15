const Sale = require('../models/Sale');
const Product = require('../models/Product');

const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RCP-${year}${month}-${random}`;
};

exports.processSale = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;

        // Verify stock availability and update quantities
        for (const item of items) {
            const product = await Product.findOne({ 
                _id: item.productId,
                userId: req.user.id 
            });

            if (!product) {
                return res.status(400).json({ message: `Product ${item.name} not found` });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${item.name}` });
            }

            // Update product quantity
            product.quantity -= item.quantity;
            await product.save();
        }

        const receiptNumber = generateReceiptNumber();
        const saleDate = new Date();

        const sale = new Sale({
            receiptNumber,
            items,
            totalAmount,
            saleDate,
            userId: req.user.id // This is now a string (UUID)
        });

        await sale.save();
        res.status(201).json({ sale, receiptNumber });
    } catch (error) {
        console.error('Error processing sale:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find({ userId: req.user.id })
            .sort({ saleDate: -1 }); // Sort by sale date in descending order
        res.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: error.message });
    }
};

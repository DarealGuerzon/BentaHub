const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.processSale = async (req, res) => {
  try {
    const { items } = req.body;

    let total = 0;

    // Verify stock availability without reducing quantities
    for (const item of items) {
      const product = await Product.findOne({ 
        _id: item.productId,
        userId: req.user.id 
      });
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.name}` });
      }
      total += item.price * item.quantity;
    }

    const sale = new Sale({
      items,
      totalAmount: total,
      userId: req.user.id
    });

    await sale.save();
    res.status(200).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RCP-${year}${month}-${random}`;
};

router.post('/add', async (req, res) => {
    try{
        const{ items, totalAmount } = req.body;
        const receiptNumber = generateReceiptNumber();
        const saleDate = new Date();

        const sale = new Sale({
            receiptNumber,
            items,
            totalAmount,
            saleDate,
        });

        await sale.save();
        res.status(201).json({ sale, receiptNumber });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});
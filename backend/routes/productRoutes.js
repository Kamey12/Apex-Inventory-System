const { protect, isAdmin } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
 

// 1. ADD A NEW PRODUCT
router.post('/add',protect, isAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. GET ALL PRODUCTS
router.get('/all',protect, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. GET LOW STOCK ALERTS 
router.get('/alerts', async (req, res) => {
    try {
        const lowStockItems = await Product.find({
            $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
        });
        res.json(lowStockItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. SELL PRODUCT
router.patch('/sell/:id',protect, async (req, res) => {
    try {
        const { quantitySold } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.quantity < quantitySold) return res.status(400).json({ message: "Not enough stock!" });

        product.quantity -= quantitySold;
        await product.save();

        await Transaction.create({
            product: product._id,
            type: 'SALE',
            quantity: quantitySold
        });

        const isLowStock = product.quantity <= product.lowStockThreshold;

        res.json({
            message: "Sale successful",
            remainingStock: product.quantity,
            alert: isLowStock ? "⚠️ LOW STOCK WARNING!" : "Stock level okay"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. UPDATE PRODUCT DETAILS
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. DELETE PRODUCT
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. RESTOCK PRODUCT
router.patch('/restock/:id', protect, isAdmin, async (req, res) => {
    try {
        const { quantityAdded } = req.body;
        if (!quantityAdded || quantityAdded <= 0) {
            return res.status(400).json({ message: "Please provide a valid quantity to add" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.quantity += Number(quantityAdded);
        await product.save();

        await Transaction.create({
            product: product._id,
            type: 'RESTOCK',
            quantity: quantityAdded
        });

        res.json({ message: "Stock updated successfully", newQuantity: product.quantity });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 8. TRANSACTION HISTORY (Restricted to Admin Only)
router.get('/history', protect, isAdmin, async (req, res) => {
    try {
        const history = await Transaction.find()
            .populate('product', 'name sku')
            .sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 9.DASHBOARD STATS 
router.get('/dashboard/stats', protect, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const lowStockCount = await Product.countDocuments({ $expr: { $lte: ["$quantity", "$lowStockThreshold"] } });
        
        const allProducts = await Product.find();
        const totalStockValue = allProducts.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

        const salesData = await Transaction.aggregate([
            { $match: { type: 'SALE' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);
        const totalSalesCount = salesData[0]?.count || 0;

        // --- CHART DATA AGGREGATION ---
        const categoryAggregation = await Product.aggregate([
            { $group: { _id: "$category", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } },
            { $sort: { value: -1 } } 
        ]);

        // 2. Revenue Trend (Area Chart): Last 7 Days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const recentSales = await Transaction.find({ type: 'SALE', date: { $gte: sevenDaysAgo } })
            .populate('product', 'price');

        const revenueByDay = {};
        for(let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            revenueByDay[dayName] = 0;
        }

        recentSales.forEach(sale => {
            if (sale.product) {
                const dayName = new Date(sale.date).toLocaleDateString('en-US', { weekday: 'short' });
                if (revenueByDay[dayName] !== undefined) {
                    revenueByDay[dayName] += (sale.quantity * sale.product.price);
                }
            }
        });

        const salesTrend = Object.keys(revenueByDay).map(key => ({
            name: key,
            revenue: revenueByDay[key]
        }));

        res.json({ 
            totalProducts, 
            lowStockCount, 
            totalStockValue, 
            totalSalesCount,
            categoryData: categoryAggregation,
            salesTrend: salesTrend
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 10. BULK SALE (Multiple items)
router.post('/bulk-sell', protect, async (req, res) => {
    try {
        const { items } = req.body;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product?.name || 'Unknown'}` });
            }

            product.quantity -= item.quantity;
            await product.save();

            await Transaction.create({
                product: product._id,
                type: 'SALE',
                quantity: item.quantity
            });
        }

        res.json({ message: "All sales processed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Uncomment to add multiple products data through json

// router.post('/add-multiple', protect, isAdmin, async (req, res) => {
//     try {
//         const products = req.body;

//         if (!Array.isArray(products)) {
//             return res.status(400).json({ message: "Please send an array of products" });
//         }

//         const savedProducts = await Product.insertMany(products);
//         res.status(201).json(savedProducts);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

module.exports = router;
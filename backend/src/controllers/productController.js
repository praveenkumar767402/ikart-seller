const { Product } = require('../models');
const syncService = require('../services/syncService');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ where: { sellerId: req.seller.id } });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, stock, status } = req.body;
        const image = req.file ? `http://localhost:8000/uploads/${req.file.filename}` : null;

        const newProduct = await Product.create({
            name,
            category,
            price,
            stock,
            status,
            image,
            sellerId: req.seller.id
        });

        // Sync to User Project
        await syncService.syncProduct(newProduct.toJSON());

        res.json(newProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id, sellerId: req.seller.id } });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { name, category, price, stock, status } = req.body;
        const updateData = { name, category, price, stock, status };

        if (req.file) {
            updateData.image = `http://localhost:8000/uploads/${req.file.filename}`;
        }

        await product.update(updateData);

        // Sync to User Project
        await syncService.syncProduct(product.toJSON());

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id, sellerId: req.seller.id } });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.destroy();

        // Sync to User Project
        await syncService.deleteProduct(req.params.id);

        res.json({ message: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

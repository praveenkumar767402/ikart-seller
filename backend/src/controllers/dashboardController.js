const { Product, Seller } = require('../models');

exports.getProfile = async (req, res) => {
    try {
        const seller = await Seller.findByPk(req.seller.id, {
            attributes: { exclude: ['password'] }
        });
        if (!seller) return res.status(404).json({ message: 'Seller not found' });
        res.json(seller);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const seller = await Seller.findByPk(req.seller.id);
        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        const { companyName, bio, location, website } = req.body;

        // Update fields if provided
        if (companyName) seller.companyName = companyName;
        if (bio !== undefined) seller.bio = bio;
        if (location !== undefined) seller.location = location;
        if (website !== undefined) seller.website = website;

        await seller.save();
        res.json({ SUCCESS: true, seller });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getStats = async (req, res) => {
    try {
        const productCount = await Product.count({ where: { sellerId: req.seller.id } });
        // Simulating other stats for now as we don't have Orders yet
        res.json({
            revenue: 0,
            orders: 0,
            products: productCount,
            growth: 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

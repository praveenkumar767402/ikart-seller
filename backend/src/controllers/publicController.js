const { Seller, Product } = require('../models');

exports.getAllCreators = async (req, res) => {
    try {
        const creators = await Seller.findAll({
            attributes: ['id', 'companyName', 'email', 'bio', 'location', 'website'] // Exclude password
        });

        // Add placeholder avatars/images since we don't have them in DB yet
        const enrichedCreators = creators.map(creator => ({
            ...creator.toJSON(),
            name: creator.companyName, // mapping companyName to name for frontend consistency
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.companyName)}&background=random&size=200`,
            category: 'Influencer', // Default category
            bio: creator.bio || 'Welcome to my official store!',
            location: creator.location || 'Global',
            followers: '10K+' // Mock data
        }));

        res.json(enrichedCreators);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCreatorById = async (req, res) => {
    try {
        const creator = await Seller.findByPk(req.params.id, {
            attributes: ['id', 'companyName', 'email', 'bio', 'location', 'website'],
            include: [{ model: Product }]
        });

        if (!creator) return res.status(404).json({ message: 'Creator not found' });

        const enrichedCreator = {
            ...creator.toJSON(),
            name: creator.companyName,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.companyName)}&background=random&size=200`,
            bio: creator.bio || 'Welcome to my official store!',
            location: creator.location || 'Global',
            website: creator.website,
            stats: {
                followers: '10K+',
                rating: '4.8'
            }
        };

        res.json(enrichedCreator);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { status: 'Active' },
            include: [{
                model: Seller,
                attributes: ['companyName']
            }]
        });

        const enrichedProducts = products.map(product => ({
            ...product.toJSON(),
            ...product.toJSON(),
            image: product.image || `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`, // Use DB image or placeholder
            creatorName: product.Seller.companyName
        }));

        res.json(enrichedProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Seller,
                attributes: ['companyName', 'id']
            }]
        });

        if (!product) return res.status(404).json({ message: 'Product not found' });

        const enrichedProduct = {
            ...product.toJSON(),
            image: product.image || `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`,
            creatorName: product.Seller.companyName,
            creatorId: product.Seller.id,
            // Mock data for missing fields
            rating: 4.8,
            reviews: 128,
            originalPrice: null, // or calculate from price * 1.2
            features: ['Premium Quality', 'Exclusive Design', 'Limited Edition', 'Creator Verified'],
            features: ['Premium Quality', 'Exclusive Design', 'Limited Edition', 'Creator Verified'],
            images: [
                product.image || `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`,
                `https://placehold.co/600x400?text=${encodeURIComponent(product.name + ' View 2')}`,
                `https://placehold.co/600x400?text=${encodeURIComponent(product.name + ' View 3')}`
            ]
        };

        res.json(enrichedProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

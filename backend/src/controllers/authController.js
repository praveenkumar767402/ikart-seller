const { Seller } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let seller = await Seller.findOne({ where: { email } });
        if (seller) return res.status(400).json({ message: 'Seller already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        seller = await Seller.create({
            companyName: name,
            email,
            password: hashedPassword
        });

        const payload = { seller: { id: seller.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: seller.id, name: seller.companyName, email: seller.email, role: 'seller' } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let seller = await Seller.findOne({ where: { email } });
        if (!seller) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const payload = { seller: { id: seller.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: seller.id, name: seller.companyName, email: seller.email, role: 'seller' } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

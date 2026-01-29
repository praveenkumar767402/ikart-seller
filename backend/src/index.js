require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); // Note: now at /api/products, not /api/seller/products
app.use('/api/seller', require('./routes/dashboardRoutes')); // Kept for consistency with frontend
app.use('/api/public', require('./routes/publicRoutes'));

// Sync DB and Start Server
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Seller Database Synced');
        app.listen(PORT, () => {
            console.log(`🚀 Seller Backend running on port ${PORT}`);
        });
    })
    .catch(err => console.error('❌ DB Error:', err));

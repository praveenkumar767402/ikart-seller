const sequelize = require('../config/database');
const Seller = require('./Seller');
const Product = require('./Product');

// Associations
Seller.hasMany(Product, { foreignKey: 'sellerId' });
Product.belongsTo(Seller, { foreignKey: 'sellerId' });

module.exports = {
    sequelize,
    Seller,
    Product
};

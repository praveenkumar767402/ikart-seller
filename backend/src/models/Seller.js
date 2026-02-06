const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seller = sequelize.define('Seller', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Sellers',
    timestamps: true
});

module.exports = Seller;

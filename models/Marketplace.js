// models/Marketplace.js
const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
    userName: String,
    itemName: String,
    price: Number,
    category: String,
    status: String
}, { collection: 'Marketplaces' });

const Marketplace = mongoose.model('Marketplace', marketplaceSchema, 'Marketplaces');

module.exports = Marketplace;


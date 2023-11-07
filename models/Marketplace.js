// models/Marketplace.js
const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
    userName: String,
    itemName: String,
    price: Number,
    category: String
});

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

module.exports = Marketplace;


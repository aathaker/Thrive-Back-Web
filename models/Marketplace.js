// models/Marketplace.js
const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    itemName: String,
    price: Number,
    category: String
});

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

module.exports = Marketplace;


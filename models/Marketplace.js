// models/Marketplace.js
const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
    plant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant'
    }],
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

});

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

module.exports = Marketplace;


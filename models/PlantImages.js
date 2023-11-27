const mongoose = require('mongoose');

const plantImagesSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  data: Buffer,
}, { collection: 'PlantImages' });

const PlantImages = mongoose.model('PlantImages', plantImagesSchema);

module.exports = PlantImages;


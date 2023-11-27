// models/Plant.js
const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  scientificName: String,
  waterFrequency: String,
  difficulty: String,
  sunlight: String,
  type: String,
  about: String,
  images: [
    {
      filename: String,
      originalname: String,
      metadata: {
        plantName: String,
      },
    },
  ],
}, { collection: 'Plants' });

const Plant = mongoose.model('Plant', plantSchema, 'Plants');

module.exports = Plant;


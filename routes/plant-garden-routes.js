const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const PlantImages = require('../models/PlantImages');
const plantController = require("../controllers/plant-controller-garden");


router.post('/user/:username/garden', plantController.addplant);

router.get('/user/:username/garden', plantController.getplant);

// Route to remove a specific plant from the user's garden
router.delete('/user/:username/garden/:plantId', plantController.deleteplant);

//filter plant
router.get('/api/plants', plantController.filterplant);


router.get('/plant-images/:imageName', async (req, res) => {
  const imageName = decodeURIComponent(req.params.imageName);
  console.log('Requesting image:', imageName);

  try {
    const plantImage = await PlantImages.findOne({ name: imageName });
    if (!plantImage) {
      console.log('Image not found in DB:', imageName);
      return res.status(404).send('Image not found');
    }

    // Convert the binary data to base64
    const imageBase64 = plantImage.data.toString('base64');
    res.send({ name: plantImage.name, data: imageBase64 });
  } catch (error) {
    console.error('Error fetching plant image:', error);
    res.status(500).send('Server error');
  }
});



module.exports = router;

const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const plantController = require("../controllers/plant-controller-garden");


router.post('/user/:username/garden', plantController.addplant);

router.get('/user/:username/garden', plantController.getplant);

// Route to remove a specific plant from the user's garden
router.delete('/user/:username/garden/:plantId', plantController.deleteplant);

//filter plant
app.get('/api/plants', plantController.filterplant);

module.exports = router;
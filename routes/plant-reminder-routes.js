const express = require("express");
const router = express.Router();

const plantReminder= require("../controllers/plant-controller-reminder");

router.post('/user/:username/reminder', plantReminder.addreminder);

router.get('/user/:username/reminder', plantReminder.getreminder);

router.delete('/user/:username/reminder/:plant', plantReminder.deletereminder);


module.exports = router;
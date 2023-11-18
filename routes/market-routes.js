const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const marketController = require("../controllers/market-controller")

router.post('/market/item', marketController.addItem);

router.get('/market/item', marketController.getItems);



module.exports = router
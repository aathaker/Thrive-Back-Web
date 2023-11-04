const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const marketController = require("../controllers/market-controller")

console.log("getting here");
router.post('/market/item', marketController.addItem);

module.exports = router
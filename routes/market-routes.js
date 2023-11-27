const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const marketController = require("../controllers/market-controller")

router.post('/market/item', marketController.addItem);

router.get('/api/market', marketController.getItems);

router.get('/market/purchase/:username/:marketId', marketController.purchaseItemUser);

router.get('/market/:username/purchases', marketController.getUserPurchases);


module.exports = router
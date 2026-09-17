const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getDeliveries,
  markDelivered,
  getKitchenCount
} = require("../controllers/deliveryController");

const router = express.Router();

router.use(protect);

router.get("/", getDeliveries);
router.get("/kitchen/count", getKitchenCount);
router.post("/:id/deliver", markDelivered);

module.exports = router;
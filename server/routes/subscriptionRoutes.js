const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createSubscription
} = require("../controllers/subscriptionController");

const router = express.Router();

router.use(protect);

router.post("/", createSubscription);

module.exports = router;
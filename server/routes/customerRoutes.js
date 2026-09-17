const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createCustomer,
  getCustomers,
  getCustomer,
  lookupByPhone
} = require("../controllers/customerController");

const router = express.Router();

router.use(protect);

router.post("/", createCustomer);
router.get("/lookup", lookupByPhone);
router.get("/", getCustomers);
router.get("/:id", getCustomer);

module.exports = router;
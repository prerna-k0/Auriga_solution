const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  generateInvoice,
  getInvoice,
  getInvoices
} = require("../controllers/invoiceController");

const router = express.Router();

router.use(protect);

router.post("/generate", generateInvoice);

router.get("/", getInvoices);

router.get("/:id", getInvoice);

module.exports = router;
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createPlan, getPlans } = require("../controllers/planController");

const router = express.Router();

router.use(protect);

router.post("/", createPlan);
router.get("/", getPlans);

module.exports = router;
const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  pauseSubscription,
  resumeSubscription,
  getPauses
} = require("../controllers/pauseController");

const router = express.Router();

router.use(protect);

router.post("/:id/pause", pauseSubscription);
router.post("/:id/resume", resumeSubscription);
router.get("/:id/pauses", getPauses);

module.exports = router;
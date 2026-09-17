const mongoose = require("mongoose");

const pauseSchema = new mongoose.Schema({
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    required: true
  },
  from_date: Date,
  to_date: Date,
  reason: String,
  requested_at: {
    type: Date,
    default: Date.now
  },
  effective_from: Date
});

module.exports = mongoose.model("Pause", pauseSchema);
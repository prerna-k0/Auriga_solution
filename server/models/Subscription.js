const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
  },
  start_date: { type: Date, required: true },
  end_date: Date,
  status: {
    type: String,
    enum: ["ACTIVE", "PAUSED", "ENDED"],
    default: "ACTIVE"
  }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
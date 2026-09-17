const mongoose = require("mongoose");

const deliveryDaySchema = new mongoose.Schema({
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["SCHEDULED", "DELIVERED", "PAUSED", "HOLIDAY"],
    default: "SCHEDULED"
  },
  pause_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pause",
    default: null
  }
});

deliveryDaySchema.index(
  { subscription_id: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("DeliveryDay", deliveryDaySchema);
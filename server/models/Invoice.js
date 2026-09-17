const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription"
  },
  month: { type: String, required: true },
  billable_days: Number,
  delivered_days: Number,
  paused_days: Number,
  rate_paise: Number,
  total_paise: Number,
  generated_at: {
    type: Date,
    default: Date.now
  }
});

invoiceSchema.index(
  { subscription_id: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
const mongoose = require("mongoose");

const invoiceLineSchema = new mongoose.Schema({
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice"
  },
  date: Date,
  status: String,
  amount_paise: Number
});

module.exports = mongoose.model("InvoiceLine", invoiceLineSchema);
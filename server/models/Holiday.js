const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  label: { type: String, required: true }
});

module.exports = mongoose.model("Holiday", holidaySchema);
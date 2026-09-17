const Plan = require("../models/Plan");

const createPlan = async (req, res) => {
  try {
    const { name, price_paise, meals_per_day } = req.body;

    const plan = await Plan.create({
      name,
      price_paise,
      meals_per_day
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ active: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPlan, getPlans };
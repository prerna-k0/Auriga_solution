const Subscription = require("../models/Subscription");
const DeliveryDay = require("../models/DeliveryDay");

const createSubscription = async (req, res) => {
  try {
    const { customer_id, plan_id, start_date, end_date } = req.body;

    const subscription = await Subscription.create({
      customer_id,
      plan_id,
      start_date,
      end_date
    });

    // Generate weekday delivery ledger
    const start = new Date(start_date);
    const end = end_date
      ? new Date(end_date)
      : new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const deliveryDays = [];

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const day = date.getDay();

      // Monday-Friday only
      if (day !== 0 && day !== 6) {
        deliveryDays.push({
          subscription_id: subscription._id,
          date: new Date(date),
          status: "SCHEDULED"
        });
      }
    }

    await DeliveryDay.insertMany(deliveryDays, { ordered: false });

    res.status(201).json({
      subscription,
      ledgerDaysCreated: deliveryDays.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubscription };
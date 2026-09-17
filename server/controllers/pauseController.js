const Pause = require("../models/Pause");
const DeliveryDay = require("../models/DeliveryDay");
const Subscription = require("../models/Subscription");

const pauseSubscription = async (req, res) => {
  try {
    const { from, to, reason } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Create pause record
    const pause = await Pause.create({
      subscription_id: subscription._id,
      from_date: fromDate,
      to_date: toDate,
      reason
    });

    // Update existing ledger rows
    await DeliveryDay.updateMany(
      {
        subscription_id: subscription._id,
        date: { $gte: fromDate, $lte: toDate },
        status: "SCHEDULED"
      },
      {
        $set: {
          status: "PAUSED",
          pause_id: pause._id
        }
      }
    );

    subscription.status = "PAUSED";
    await subscription.save();

    res.json({
      message: "Subscription paused",
      pause
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resumeSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.status = "ACTIVE";
    await subscription.save();

    res.json({
      message: "Subscription resumed"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPauses = async (req, res) => {
  const pauses = await Pause.find({
    subscription_id: req.params.id
  }).sort({ from_date: -1 });

  res.json(pauses);
};

module.exports = {
  pauseSubscription,
  resumeSubscription,
  getPauses
};
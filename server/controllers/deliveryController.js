const DeliveryDay = require("../models/DeliveryDay");

const getDeliveries = async (req, res) => {
  try {
    const date = new Date(req.query.date);

    const deliveries = await DeliveryDay.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    }).populate("subscription_id");

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markDelivered = async (req, res) => {
  try {
    const delivery = await DeliveryDay.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.status === "PAUSED") {
      return res.status(400).json({
        message: "Paused delivery cannot be marked delivered"
      });
    }

    delivery.status = "DELIVERED";
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  
};

const getKitchenCount = async (req, res) => {
  try {
    const date = new Date(req.query.date);

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const count = await DeliveryDay.countDocuments({
      date: { $gte: start, $lte: end },
      status: { $in: ["SCHEDULED", "DELIVERED"] }
    });

    const paused = await DeliveryDay.countDocuments({
      date: { $gte: start, $lte: end },
      status: "PAUSED"
    });

    res.json({
      date: req.query.date,
      cook: count,
      paused
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getDeliveries, markDelivered , getKitchenCount};
const Invoice = require("../models/Invoice");
const InvoiceLine = require("../models/InvoiceLine");
const DeliveryDay = require("../models/DeliveryDay");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

const generateInvoice = async (req, res) => {
  try {
    const { month } = req.body; // "2026-09"

    const start = new Date(`${month}-01`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const subscriptions = await Subscription.find({
      start_date: { $lte: end },
      $or: [
        { end_date: null },
        { end_date: { $gte: start } }
      ]
    });

    const invoices = [];

    for (const subscription of subscriptions) {

      // Prevent duplicate invoice
      const existing = await Invoice.findOne({
        subscription_id: subscription._id,
        month
      });

      if (existing) {
        invoices.push(existing);
        continue;
      }

      const plan = await Plan.findById(subscription.plan_id);

      const days = await DeliveryDay.find({
        subscription_id: subscription._id,
        date: { $gte: start, $lte: end }
      }).sort({ date: 1 });

      const billableDays = days.filter(
        d => d.status !== "HOLIDAY"
      ).length;

      const deliveredDays = days.filter(
        d => d.status === "DELIVERED"
      ).length;

      const pausedDays = days.filter(
        d => d.status === "PAUSED"
      ).length;

      if (billableDays === 0) continue;

      const ratePaise = Math.floor(
        plan.price_paise / billableDays
      );

      const totalPaise = ratePaise * deliveredDays;

      const invoice = await Invoice.create({
        customer_id: subscription.customer_id,
        subscription_id: subscription._id,
        month,
        billable_days: billableDays,
        delivered_days: deliveredDays,
        paused_days: pausedDays,
        rate_paise: ratePaise,
        total_paise: totalPaise
      });

      // Create invoice lines
      const lines = days.map(day => ({
        invoice_id: invoice._id,
        date: day.date,
        status: day.status,
        amount_paise:
          day.status === "DELIVERED" ? ratePaise : 0
      }));

      await InvoiceLine.insertMany(lines);

      invoices.push(invoice);
    }

    res.status(201).json({
      message: "Invoices generated",
      invoices
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer_id")
      .populate("subscription_id");

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    const lines = await InvoiceLine.find({
      invoice_id: invoice._id
    }).sort({ date: 1 });

    res.json({
      invoice,
      lines
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoices = async (req, res) => {
  try {
    const {
      month,
      page = 1,
      limit = 10,
      sort = "generated_at",
      order = "desc"
    } = req.query;

    const filter = month ? { month } : {};

    const skip = (page - 1) * limit;

    const total = await Invoice.countDocuments(filter);

    const invoices = await Invoice.find(filter)
      .populate("customer_id")
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      data: invoices,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateInvoice,
  getInvoice,
  getInvoices
};
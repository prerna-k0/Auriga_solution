const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const customer = await Customer.create({
      name,
      phone,
      address
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const {
      q = "",
      page = 1,
      limit = 10,
      sort = "name",
      order = "asc"
    } = req.query;

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } }
          ]
        }
      : {};

    const skip = (page - 1) * limit;

    const total = await Customer.countDocuments(filter);

    const customers = await Customer.find(filter)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      data: customers,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const lookupByPhone = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      phone: { $regex: req.query.phone || "", $options: "i" }
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  lookupByPhone
};
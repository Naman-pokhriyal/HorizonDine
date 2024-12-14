const Customer = require("../schema/customer");

const getCustomer = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const addCustomer = async (req, res) => {
  try {
    const { fname, lname, phone } = req.body;
    const customer = new Customer({ fname, lname, phone });

    await customer.save();

    req.app.get("io").emit("customerAdded", customer);
    res.status(200).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getCustomer, addCustomer };

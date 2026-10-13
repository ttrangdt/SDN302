//2. CRUD customer
const Book = require("./models/Book");

//3. GET all customer
exports.getAllBook = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//4. GET customer by id
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//5. PoST create a customer
exports.createCustomer = async (req, res) => {
  try {
    const newCus = new Customer(req.body);
    await newCus.save();
    res.status(201).json(newCus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//6. PUT update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//7. DELETE a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//8. Find customer by name
exports.findCustomerByName = async (req, res) => {
  try {
    const customer = await Customer.find({ name: req.params.name });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//9. Find customer by phone
exports.findCustomerByPhone = async (req, res) => {
  try {
    const customer = await Customer.find({ phone: req.params.phone });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

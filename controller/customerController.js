const config = require("config");
const Customer = require("../models/customer.model");
const axios = require("axios");
const { Op } = require("sequelize");

exports.addCustomer = async (req, res) => {
  const { id, customer_name, customer_address } = req.body;

  try {
    const data = {
      // id: id,
      customer_name: customer_name,
      customer_address: customer_address,
    };

    const savedData = await Customer.create(data);

    res.status(201).json({
      status: 201,
      message: "Item Created Successfully",
      data: savedData.dataValues,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.editCustomer = async (req, res) => {
  const { id, customer_name, customer_address } = req.body;
  console.log(req.body);

  try {
    const record = await Customer.findByPk(id);

    record.customer_name = customer_name;
    record.customer_address = customer_address;

    const saved = await record.save();

    res.status(201).json({
      status: 201,
      message: "Customer Updated Successfully",
      data: saved.dataValues,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getCustomers = async (req, res) => {
  const { page, perPage } = req.query;

  try {
    const customers = await Customer.findAll({
      offset: (parseInt(page) - 1) * parseInt(perPage),
      limit: parseInt(perPage),
    });
    console.log(customers);
    res.status(200).json({
      status: 200,
      message: "Customers Are Fetched Successfully",
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getCustomersByName = async (req, res) => {
  const { name } = req.query;

  try {
    const customers = await Customer.findAll({
      where: {
        customer_name: {
          [Op.like]: `${name}%`, // Case-insensitive search for name
        },
      },
      offset: 0,
      limit: 20,
    });
    console.log(customers);
    res.status(200).json({
      status: 200,
      message: "Customers Are Fetched Successfully",
      data: customers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};


exports.deleteCustomer = async (req, res) => {
  const { id } = req.query;

  try {
    // Find the user by ID
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Delete the user
    await customer.destroy();

    res.status(200).json({ message: "customer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
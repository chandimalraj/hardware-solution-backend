const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const SalesRep = require("../models/salesrep.model");

exports.getUser = async (req, res) => {
  res.send({
    user: {
      name: "chandimal",
      age: 26,
    },
  });
};

exports.addUser = async (req, res) => {
  try {
    const { id, username, password, role } = req.body;

    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    const data = {
      // id: id,
      username: username,
      password: hashedPassword,
      role: role,
    };

    const savedData = await User.create(data);

    res.status(201).json({
      status: 201,
      message: "Record Created Successfully",
      data: savedData.dataValues,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.addSalesRep = async (req, res) => {
  try {
    const { id, name, password, nic } = req.body;

    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    const data = {
      id: id,
      name: name,
      password: hashedPassword,
      nic: nic,
    };

    const savedData = await SalesRep.create(data);

    res.status(201).json({
      status: 201,
      message: "Record Created Successfully",
      data: savedData.dataValues,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.getSalesReps = async (req, res) => {
  try {
    const salesReps = await SalesRep.findAll();
    res.status(200).json({
      status: 200,
      data: salesReps,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

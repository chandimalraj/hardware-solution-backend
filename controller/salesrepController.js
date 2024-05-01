const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const SalesRep = require("../models/salesrep.model");

exports.loginSalesRep = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await SalesRep.findOne({ where: { name: username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const hashedPassword = user.dataValues.password;
    console.log(hashedPassword);
    // Compare the hashed password with the provided password
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: 401, error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, type: "SALES_REP" },
      config.get("jwtsecret"),
      {
        expiresIn: "48h",
      }
    );

    res
      .status(200)
      .json({ status: 200, message: "Login successful", data: token });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addSalesRep = async (req, res) => {
  const { id, name, password, nic } = req.body;
  // Generate a salt
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password with the salt
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const data = {
      id: id,
      name: name,
      password: hashedPassword,
      nic: nic,
    };

    const savedData = await SalesRep.create(data);

    res.status(201).json({
      status: 201,
      message: "SalesRep Created Successfully",
      data: savedData.dataValues,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.editSalesRep = async (req, res) => {
  const { id, name, password, nic } = req.body;

  try {
    const record = await SalesRep.findByPk(id);

    record.name = name;
    record.password = password;
    record.nic = nic;

    const saved = await record.save();

    res.status(201).json({
      status: 201,
      message: "SalesRep Updated Successfully",
      data: saved.dataValues,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

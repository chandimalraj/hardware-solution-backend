const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user.model");
const SalesRep = require("../models/salesrep.model");

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });
   
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Compare the hashed password with the provided password
    const hashedPassword = user.dataValues.password;
    console.log(hashedPassword);
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: 401, error: "Invalid password" });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, config.get('jwtsecret'), { expiresIn: '48h' });

    res
      .status(200)
      .json({ status: 200, message: "Login successful", data: token });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.loginSalesRep = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await SalesRep.findOne({ where: { username: username } });
      const hashedPassword = user.dataValues.password;
      console.log(hashedPassword);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Compare the hashed password with the provided password
      const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
      if (!isPasswordMatch) {
        return res.status(401).json({ status: 401, error: "Invalid password" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, config.get('jwtsecret'), { expiresIn: '48h' });
  
      res
        .status(200)
        .json({ status: 200, message: "Login successful", data: token });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
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
      const token = jwt.sign({ userId: user.id }, config.get('jwtsecret'), { expiresIn: '48h' });
  
      res
        .status(200)
        .json({ status: 200, message: "Login successful", data: token });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
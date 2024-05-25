const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("../models/order.model");

const Customer = sequelize.define("customer", {
  // Define model attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customer_address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  area: {
    type: DataTypes.ENUM(
      "DAMBULLA",
      "POLONNARUWA",
      "ANURADHAPURA",
      "MONARAGALA",
      "AMPARA",
      "BADULLA",
      "RATNAPURA",
      "GAMPAHA",
      "COLOMBO",
      "MAHIYANGANAYA",
      "CHILLAW",
      "PUTTALAM",
      "JAFFNA",
      "DEHIATTAKANDIYA",
      "SIYAMBALANDUWA"
    ),
    allowNull: false,
  },
});

Customer.hasMany(Order);
Order.belongsTo(Customer);

module.exports = Customer;

const { DataTypes } = require("sequelize");
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
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },

  customer_address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

Customer.hasMany(Order);
Order.belongsTo(Customer);

module.exports = Customer;

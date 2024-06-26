// salesrep.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("../models/order.model");

const Salesrep = sequelize.define("salesrep", {
  // Define model attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Salesrep.hasMany(Order);
Order.belongsTo(Salesrep);
module.exports = Salesrep;

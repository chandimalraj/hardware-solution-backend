const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Item = require("../models/item.model");
const OrderItems = require("../models/order_items.model");

const Order = sequelize.define("order", {
  // Define model attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  payment_type: {
    type: DataTypes.ENUM("CASH", "CHEQUE"),
    allowNull: false,
    // unique:true
  },
});

Order.belongsToMany(Item, { through: OrderItems });
// Item.belongsToMany(Order, { through: OrderItems });

module.exports = Order;

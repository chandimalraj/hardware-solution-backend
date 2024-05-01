const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItems = sequelize.define("order_items", {
  // Define model attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Order.belongsToMany(Item,{through:'order_items'})
// Item.belongsToMany(Order,{through:'order_items'})

module.exports = OrderItems;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('item', {
  // Define model attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('HARDWARE','CHEMICAL','STEEL','PVC','ELECTRICAL','BOLT_NUT','PLUMBING','OTHER'),
    allowNull: false
  },
  quantity:{
    type:DataTypes.INTEGER,
    allowNull:true
  },
  price:{
    type:DataTypes.FLOAT,
    defaultValue:0,
    allowNull:true
  }
});

module.exports = Item;

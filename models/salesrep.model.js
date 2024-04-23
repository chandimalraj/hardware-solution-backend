// salesrep.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salesrep = sequelize.define('Salesrep', {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nic: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Salesrep;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  telegramId: {
    type: DataTypes.BIGINT,
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tonWallet: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usdtWallet: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tonBalance: {
    type: DataTypes.DECIMAL(18, 9),
    defaultValue: 0.0
  },
  usdtBalance: {
    type: DataTypes.DECIMAL(18, 6),
    defaultValue: 0.0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;

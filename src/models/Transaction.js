const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  fromUserId: {
    type: DataTypes.BIGINT,
    allowNull: true // null для пополнений
  },
  toUserId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(18, 9),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer', 'exchange'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'completed'
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'transactions',
  timestamps: false
});

module.exports = Transaction;

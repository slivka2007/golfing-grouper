const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BookingPlatform = sequelize.define('BookingPlatform', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  api_endpoint: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  scrape_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  api_key: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'booking_platforms',
  timestamps: true,
  underscored: true
});

module.exports = BookingPlatform; 
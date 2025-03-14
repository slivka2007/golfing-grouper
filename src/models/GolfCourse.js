const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GolfCourse = sequelize.define('GolfCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  zip_code: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  booking_platform_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'booking_platforms',
      key: 'id'
    }
  }
}, {
  tableName: 'golf_courses',
  timestamps: true,
  underscored: true
});

module.exports = GolfCourse; 
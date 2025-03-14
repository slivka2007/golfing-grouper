const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TeeTime = sequelize.define('TeeTime', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  booking_platform_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'booking_platforms',
      key: 'id'
    }
  },
  course_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  holes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[9, 18]]
    }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  total_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  booking_url: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'tee_times',
  timestamps: true,
  underscored: true
});

module.exports = TeeTime; 
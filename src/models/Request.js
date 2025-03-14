const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tee_time_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tee_times',
      key: 'id'
    }
  },
  group_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 4
    }
  },
  preferences: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  stripe_customer_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'matched', 'confirmed', 'completed', 'cancelled']]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'requests',
  timestamps: true,
  underscored: true
});

module.exports = Request; 
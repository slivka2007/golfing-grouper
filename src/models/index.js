const { sequelize } = require('../config/db');
const User = require('./User');
const GolfCourse = require('./GolfCourse');
const BookingPlatform = require('./BookingPlatform');
const TeeTime = require('./TeeTime');
const Request = require('./Request');

// Define associations
BookingPlatform.hasMany(GolfCourse, {
  foreignKey: 'booking_platform_id',
  as: 'golfCourses'
});
GolfCourse.belongsTo(BookingPlatform, {
  foreignKey: 'booking_platform_id',
  as: 'bookingPlatform'
});

BookingPlatform.hasMany(TeeTime, {
  foreignKey: 'booking_platform_id',
  as: 'teeTimes'
});
TeeTime.belongsTo(BookingPlatform, {
  foreignKey: 'booking_platform_id',
  as: 'bookingPlatform'
});

TeeTime.hasMany(Request, {
  foreignKey: 'tee_time_id',
  as: 'requests'
});
Request.belongsTo(TeeTime, {
  foreignKey: 'tee_time_id',
  as: 'teeTime'
});

User.hasMany(Request, {
  foreignKey: 'user_id',
  as: 'requests'
});
Request.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Export models
module.exports = {
  sequelize,
  User,
  GolfCourse,
  BookingPlatform,
  TeeTime,
  Request
}; 
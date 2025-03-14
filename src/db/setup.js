const { sequelize } = require('../config/db');
const { User, GolfCourse, BookingPlatform, TeeTime, Request } = require('../models');

// Function to synchronize database
const syncDatabase = async () => {
  try {
    console.log('Starting database synchronization...');
    
    // Force: true will drop the table if it already exists (for development only)
    const force = process.env.NODE_ENV === 'development' && process.env.DB_FORCE_SYNC === 'true';
    
    // Sync all models
    await sequelize.sync({ force });
    
    console.log('Database synchronized successfully');

    // If in development mode and we're recreating the DB, seed some initial data
    if (force) {
      await seedDatabaseWithMockData();
    }

    return true;
  } catch (error) {
    console.error('Error synchronizing database:', error);
    return false;
  }
};

// Function to seed database with initial data (for development)
const seedDatabaseWithMockData = async () => {
  try {
    console.log('Seeding database with initial data...');

    // Create a booking platform with API
    const apiBookingPlatform = await BookingPlatform.create({
      name: 'GolfNow',
      api_endpoint: 'https://api.golfnow.com/v1',
      api_key: 'demo_key_123456'
    });

    // Create a booking platform with scraping
    const scrapeBookingPlatform = await BookingPlatform.create({
      name: 'TeeOff',
      scrape_url: 'https://www.teeoff.com',
      api_key: null
    });

    // Create a golf course
    const golfCourse = await GolfCourse.create({
      name: 'Demo Golf Club',
      zip_code: '90210',
      booking_platform_id: apiBookingPlatform.id
    });

    // Create a tee time
    const teeTime = await TeeTime.create({
      booking_platform_id: apiBookingPlatform.id,
      course_name: 'Demo Golf Club',
      date_time: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      holes: 18,
      capacity: 4,
      total_cost: 89.99,
      booking_url: 'https://api.golfnow.com/tee-times/123456'
    });

    console.log('Initial data seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// Run in standalone mode if called directly
if (require.main === module) {
  syncDatabase()
    .then((success) => {
      console.log(success ? 'Database setup completed successfully' : 'Database setup failed');
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Unexpected error during database setup:', error);
      process.exit(1);
    });
}

module.exports = { syncDatabase }; 
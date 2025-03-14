/**
 * Scraper Worker
 * 
 * This worker runs periodically to scrape tee time data from various booking platforms
 * and store it in the database for quick searching.
 */

require('dotenv').config();
const cron = require('node-cron');
const { BookingPlatform, TeeTime } = require('../models');
const golfNowScraper = require('../services/scrapers/golfNowScraper');
const { Op } = require('sequelize');

// Map platform names to scraper modules
const scrapers = {
  'GolfNow': golfNowScraper,
  // Add more scrapers as they are implemented
};

/**
 * Scrape tee times from a specific platform
 *
 * @param {Object} platform - The booking platform record
 * @param {Array} locations - Array of ZIP codes or locations to search
 * @param {string} date - Date to search for (YYYY-MM-DD)
 * @returns {Promise<number>} - Number of tee times scraped
 */
const scrapePlatform = async (platform, locations, date) => {
  try {
    const scraper = scrapers[platform.name];
    if (!scraper) {
      console.warn(`No scraper available for platform: ${platform.name}`);
      return 0;
    }
    
    console.log(`Scraping tee times from ${platform.name} for ${date}`);
    
    let totalScraped = 0;
    
    // Process each location
    for (const location of locations) {
      // Search for tee times
      const teeTimesData = await scraper.searchTeeTimes({
        location,
        date,
        players: 1, // Search for single player tee times to get all options
        holes: 0    // Search for both 9 and 18 hole options
      });
      
      console.log(`Found ${teeTimesData.length} tee times for ${location}`);
      
      // Process and store each tee time
      for (const teeTimeData of teeTimesData) {
        // Check if tee time already exists in database
        const [teeTime, created] = await TeeTime.findOrCreate({
          where: {
            booking_platform_id: platform.id,
            course_name: teeTimeData.course_name,
            date_time: new Date(teeTimeData.date_time),
            booking_url: teeTimeData.booking_url
          },
          defaults: {
            holes: teeTimeData.holes || 18,
            capacity: teeTimeData.capacity || 4,
            total_cost: teeTimeData.price || 0
          }
        });
        
        if (created) {
          totalScraped++;
        }
      }
    }
    
    return totalScraped;
  } catch (error) {
    console.error(`Error scraping ${platform.name}:`, error);
    return 0;
  }
};

/**
 * Run a scraping job for all configured platforms
 */
const runScrapingJob = async () => {
  try {
    console.log('Starting tee time scraping job');
    
    // Get all platforms that have scrape_url set
    const platforms = await BookingPlatform.findAll({
      where: {
        scrape_url: {
          [Op.not]: null
        }
      }
    });
    
    if (platforms.length === 0) {
      console.log('No platforms configured for scraping');
      return;
    }
    
    console.log(`Found ${platforms.length} platforms to scrape`);
    
    // Define locations to search (zip codes)
    // In production, this would come from popular locations or user searches
    const locations = ['90210', '10001', '60601', '75001', '33139'];
    
    // Calculate dates to scrape (today + next 7 days)
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    
    let totalTeeTimes = 0;
    
    // Scrape each platform for each date
    for (const platform of platforms) {
      for (const date of dates) {
        const teeTimesCount = await scrapePlatform(platform, locations, date);
        totalTeeTimes += teeTimesCount;
      }
    }
    
    console.log(`Scraping job completed. Added ${totalTeeTimes} new tee times.`);
  } catch (error) {
    console.error('Error in scraping job:', error);
  }
};

// Schedule scraping job to run according to cron schedule in .env
if (process.env.SCRAPER_CRON_SCHEDULE) {
  console.log(`Scheduling scraper to run according to: ${process.env.SCRAPER_CRON_SCHEDULE}`);
  
  cron.schedule(process.env.SCRAPER_CRON_SCHEDULE, () => {
    runScrapingJob();
  });
}

// Run immediately if this file is executed directly
if (require.main === module) {
  runScrapingJob()
    .then(() => {
      if (!process.env.SCRAPER_CRON_SCHEDULE) {
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('Fatal error in scraper worker:', error);
      process.exit(1);
    });
}

module.exports = { runScrapingJob }; 
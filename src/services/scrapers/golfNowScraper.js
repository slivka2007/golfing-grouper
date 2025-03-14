/**
 * GolfNow Scraper Service
 * 
 * This service handles scraping tee time data from GolfNow.com
 */

const { fetchHtml, parseHtml, parseTable } = require('../../utils/scraping/axiosUtils');
const { initBrowser, createPage, extractPageData } = require('../../utils/scraping/puppeteerUtils');

/**
 * Search for tee times on GolfNow based on location, date, and other criteria
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.location - ZIP code or city name
 * @param {string} params.date - Date in YYYY-MM-DD format
 * @param {number} params.players - Number of players (1-4)
 * @param {number} params.holes - Number of holes (9 or 18)
 * @returns {Promise<Array>} - Array of tee time objects
 */
const searchTeeTimes = async ({ location, date, players = 1, holes = 18 }) => {
  try {
    // Format date as MM-DD-YYYY for GolfNow URL
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-') : '';
    
    // Create URL for search
    const url = `https://www.golfnow.com/tee-times/search#${location}/${formattedDate}/${players}/${holes}`;
    
    // Use Puppeteer for this search as it requires JavaScript rendering
    const browser = await initBrowser();
    const page = await createPage(browser);
    
    console.log(`Searching GolfNow for tee times: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for results to load
    await page.waitForSelector('.tee-time-facility-container', { timeout: 30000 }).catch(() => {});
    
    // Extract tee time data
    const teeTimeData = await page.evaluate(() => {
      const results = [];
      
      // Find all tee time cards on the page
      const teeTimeElements = document.querySelectorAll('.tee-time-facility-container');
      
      teeTimeElements.forEach(element => {
        try {
          const courseName = element.querySelector('.facility-name')?.textContent.trim() || '';
          const courseDetails = element.querySelectorAll('.tee-time-container');
          
          // Process each tee time for this course
          courseDetails.forEach(teeTime => {
            // Extract basic tee time info
            const timeElement = teeTime.querySelector('.time')?.textContent.trim() || '';
            const priceElement = teeTime.querySelector('.price')?.textContent.trim() || '';
            const holesElement = teeTime.querySelector('.holes')?.textContent.trim() || '';
            const playersElement = teeTime.querySelector('.players')?.textContent.trim() || '';
            
            // Extract booking link
            const bookingLink = teeTime.querySelector('a.book-now')?.href || '';
            
            // Create tee time object
            results.push({
              platform: 'GolfNow',
              course_name: courseName,
              date_time: `${date} ${timeElement}`,
              holes: holesElement.includes('9') ? 9 : 18,
              capacity: parseInt(playersElement.replace(/\D/g, '')) || 4,
              price: parseFloat(priceElement.replace(/[^0-9.]/g, '')) || 0,
              booking_url: bookingLink,
              raw_details: teeTime.textContent.trim()
            });
          });
        } catch (error) {
          console.error('Error processing tee time element:', error);
        }
      });
      
      return results;
    });
    
    await browser.close();
    return teeTimeData;
  } catch (error) {
    console.error('Error scraping GolfNow:', error);
    throw new Error(`GolfNow scraping failed: ${error.message}`);
  }
};

/**
 * Get details about a specific tee time from its URL
 * 
 * @param {string} url - The booking URL for the tee time
 * @returns {Promise<Object>} - Detailed tee time information
 */
const getTeeTimeDetails = async (url) => {
  try {
    // For this endpoint, we can use simple Axios/Cheerio scraping
    const html = await fetchHtml(url);
    
    // Define selectors for the data we want to extract
    const selectors = {
      courseName: '.facility-name',
      dateTime: '.tee-time-date-time',
      price: '.tee-time-price',
      playerCount: '.tee-time-players',
      holeCount: '.tee-time-holes',
      additionalInfo: '.tee-time-additional-info'
    };
    
    // Parse the HTML and extract the data
    const details = parseHtml(html, selectors);
    
    return {
      platform: 'GolfNow',
      course_name: details.courseName,
      date_time: details.dateTime,
      holes: details.holeCount?.includes('9') ? 9 : 18,
      capacity: parseInt(details.playerCount?.replace(/\D/g, '')) || 4,
      price: parseFloat(details.price?.replace(/[^0-9.]/g, '')) || 0,
      booking_url: url,
      additional_info: details.additionalInfo
    };
  } catch (error) {
    console.error('Error getting tee time details:', error);
    throw new Error(`Failed to get tee time details: ${error.message}`);
  }
};

module.exports = {
  searchTeeTimes,
  getTeeTimeDetails
}; 
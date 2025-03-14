/**
 * Puppeteer Utilities for Web Scraping
 * 
 * This module provides utility functions for Puppeteer-based web scraping
 * of golf booking platforms that don't provide an API.
 */

const puppeteer = require('puppeteer');

/**
 * Initialize a Puppeteer browser instance
 * 
 * @param {boolean} headless - Whether to run in headless mode
 * @returns {Promise<Browser>} - Puppeteer browser instance
 */
const initBrowser = async (headless = true) => {
  return await puppeteer.launch({
    headless: headless ? 'new' : false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
};

/**
 * Create a new page with common settings
 * 
 * @param {Browser} browser - Puppeteer browser instance
 * @returns {Promise<Page>} - Configured Puppeteer page
 */
const createPage = async (browser) => {
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1366, height: 768 });
  
  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36');
  
  // Block unnecessary resources to speed up scraping
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (resourceType === 'image' || resourceType === 'font' || resourceType === 'media') {
      req.abort();
    } else {
      req.continue();
    }
  });
  
  return page;
};

/**
 * Wait for navigation to complete with timeout
 * 
 * @param {Page} page - Puppeteer page
 * @param {Object} options - Navigation options
 * @returns {Promise<Response|null>} - Navigation response
 */
const safeNavigation = async (page, options = {}) => {
  try {
    return await page.waitForNavigation({
      waitUntil: 'networkidle2',
      timeout: 30000,
      ...options
    });
  } catch (error) {
    console.warn('Navigation timeout or error:', error.message);
    return null;
  }
};

/**
 * Extract data from a page using specified selectors
 * 
 * @param {Page} page - Puppeteer page
 * @param {Object} selectors - Object mapping data keys to CSS selectors
 * @returns {Promise<Object>} - Extracted data
 */
const extractPageData = async (page, selectors) => {
  const result = {};
  
  for (const [key, selector] of Object.entries(selectors)) {
    try {
      const element = await page.$(selector);
      if (element) {
        result[key] = await page.evaluate(el => el.textContent.trim(), element);
      } else {
        result[key] = null;
      }
    } catch (error) {
      console.warn(`Error extracting ${key}: ${error.message}`);
      result[key] = null;
    }
  }
  
  return result;
};

module.exports = {
  initBrowser,
  createPage,
  safeNavigation,
  extractPageData
}; 
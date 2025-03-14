/**
 * Axios Utilities for Web Scraping
 * 
 * This module provides utility functions for Axios-based HTTP requests
 * used for simpler web scraping tasks or API integrations.
 */

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Create a configured Axios instance with common headers
 * 
 * @param {Object} config - Additional axios configuration
 * @returns {AxiosInstance} - Configured axios instance
 */
const createAxiosInstance = (config = {}) => {
  return axios.create({
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    ...config
  });
};

/**
 * Fetch HTML content from a URL
 * 
 * @param {string} url - URL to fetch
 * @param {Object} config - Axios request configuration
 * @returns {Promise<string>} - HTML content
 */
const fetchHtml = async (url, config = {}) => {
  try {
    const instance = createAxiosInstance(config);
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    throw error;
  }
};

/**
 * Parse HTML and extract data using selectors
 * 
 * @param {string} html - HTML content to parse
 * @param {Object} selectors - Object mapping data keys to CSS selectors
 * @returns {Object} - Extracted data
 */
const parseHtml = (html, selectors) => {
  const $ = cheerio.load(html);
  const result = {};
  
  for (const [key, selector] of Object.entries(selectors)) {
    try {
      const element = $(selector);
      if (element.length) {
        result[key] = element.text().trim();
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

/**
 * Extract data from HTML tables
 * 
 * @param {string} html - HTML content to parse
 * @param {string} tableSelector - CSS selector for the table
 * @param {Array<string>} headers - Column headers to use as keys
 * @returns {Array<Object>} - Parsed table data
 */
const parseTable = (html, tableSelector, headers = []) => {
  const $ = cheerio.load(html);
  const rows = [];
  
  $(tableSelector).find('tr').each((rowIndex, row) => {
    // Skip header row
    if (rowIndex === 0 && headers.length === 0) {
      // Extract headers from first row if not provided
      headers = $(row).find('th,td').map((i, cell) => $(cell).text().trim()).get();
      return;
    }
    
    const rowData = {};
    $(row).find('td').each((cellIndex, cell) => {
      if (cellIndex < headers.length) {
        rowData[headers[cellIndex]] = $(cell).text().trim();
      }
    });
    
    if (Object.keys(rowData).length > 0) {
      rows.push(rowData);
    }
  });
  
  return rows;
};

module.exports = {
  createAxiosInstance,
  fetchHtml,
  parseHtml,
  parseTable
}; 
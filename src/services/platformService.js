/**
 * Platform Service
 * 
 * This service handles integration with booking platforms via their APIs
 */

const axios = require('axios');
const { BookingPlatform, TeeTime } = require('../models');

/**
 * Create a configured Axios instance for a booking platform
 * 
 * @param {Object} platform - The booking platform object
 * @returns {Object} - Configured axios instance
 */
const createApiClient = (platform) => {
  return axios.create({
    baseURL: platform.api_endpoint,
    timeout: 10000,
    headers: {
      'Authorization': `Bearer ${platform.api_key}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

/**
 * Search for tee times on a platform via API
 * 
 * @param {number} platformId - The booking platform ID
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Array>} - Array of tee time objects
 */
const searchTeeTimes = async (platformId, searchParams) => {
  try {
    // Get platform details
    const platform = await BookingPlatform.findByPk(platformId);
    if (!platform || !platform.api_endpoint) {
      throw new Error('Platform not found or API endpoint not configured');
    }
    
    // Create API client
    const client = createApiClient(platform);
    
    // Call the platform's search API
    const response = await client.get('/tee-times/search', {
      params: searchParams
    });
    
    // Map the platform's response to our standard format
    return mapApiResponseToTeeTimeObjects(response.data, platform);
  } catch (error) {
    console.error(`Error searching tee times on platform ${platformId}:`, error);
    throw new Error(`API search failed: ${error.message}`);
  }
};

/**
 * Map platform API response to standardized tee time objects
 * 
 * @param {Object} apiResponse - The platform's API response
 * @param {Object} platform - The booking platform object
 * @returns {Array} - Array of standardized tee time objects
 */
const mapApiResponseToTeeTimeObjects = (apiResponse, platform) => {
  try {
    // Different platforms have different response formats
    // This function handles the mapping based on the platform
    switch (platform.name) {
      case 'GolfNow API':
        return apiResponse.tee_times.map(teeTime => ({
          booking_platform_id: platform.id,
          course_name: teeTime.course.name,
          date_time: new Date(teeTime.date_time),
          holes: teeTime.holes,
          capacity: teeTime.player_count,
          total_cost: teeTime.rate.total_price,
          booking_url: teeTime.booking_url
        }));
        
      case 'TeeOff API':
        return apiResponse.availableTimes.map(teeTime => ({
          booking_platform_id: platform.id,
          course_name: teeTime.courseName,
          date_time: new Date(`${teeTime.date}T${teeTime.time}`),
          holes: teeTime.holes,
          capacity: teeTime.maxPlayers,
          total_cost: teeTime.pricePerPlayer * teeTime.maxPlayers,
          booking_url: `${platform.api_endpoint}/book/${teeTime.id}`
        }));
        
      default:
        console.warn(`No mapping defined for platform: ${platform.name}`);
        return [];
    }
  } catch (error) {
    console.error('Error mapping API response:', error);
    return [];
  }
};

/**
 * Book a tee time on a platform via API
 * 
 * @param {number} teeTimeId - The tee time ID
 * @param {Object} bookingDetails - Booking details
 * @returns {Promise<Object>} - Booking confirmation
 */
const bookTeeTime = async (teeTimeId, bookingDetails) => {
  try {
    // Get tee time details including the platform
    const teeTime = await TeeTime.findByPk(teeTimeId, {
      include: [{ model: BookingPlatform, as: 'bookingPlatform' }]
    });
    
    if (!teeTime) {
      throw new Error('Tee time not found');
    }
    
    const platform = teeTime.bookingPlatform;
    
    // Create API client
    const client = createApiClient(platform);
    
    // Format booking data according to the platform's requirements
    const bookingData = formatBookingData(teeTime, bookingDetails, platform);
    
    // Call the platform's booking API
    const response = await client.post('/bookings', bookingData);
    
    return {
      success: true,
      confirmation_code: response.data.confirmation_code,
      booking_details: response.data
    };
  } catch (error) {
    console.error(`Error booking tee time ${teeTimeId}:`, error);
    throw new Error(`Booking failed: ${error.message}`);
  }
};

/**
 * Format booking data for a specific platform
 * 
 * @param {Object} teeTime - The tee time object
 * @param {Object} bookingDetails - Booking details
 * @param {Object} platform - The booking platform object
 * @returns {Object} - Formatted booking data
 */
const formatBookingData = (teeTime, bookingDetails, platform) => {
  // Different platforms have different booking data formats
  switch (platform.name) {
    case 'GolfNow API':
      return {
        tee_time_id: teeTime.id,
        player_count: bookingDetails.playerCount,
        players: bookingDetails.players.map(player => ({
          first_name: player.firstName,
          last_name: player.lastName,
          email: player.email
        })),
        payment: {
          payment_method_id: bookingDetails.paymentMethodId
        }
      };
      
    case 'TeeOff API':
      return {
        timeId: teeTime.id,
        players: bookingDetails.playerCount,
        customerInformation: {
          firstName: bookingDetails.players[0].firstName,
          lastName: bookingDetails.players[0].lastName,
          email: bookingDetails.players[0].email,
          phone: bookingDetails.players[0].phone
        },
        paymentToken: bookingDetails.paymentMethodId
      };
      
    default:
      throw new Error(`No booking format defined for platform: ${platform.name}`);
  }
};

module.exports = {
  searchTeeTimes,
  bookTeeTime
}; 
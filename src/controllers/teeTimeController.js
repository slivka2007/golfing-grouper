const { TeeTime, GolfCourse, BookingPlatform } = require('../models');
const { searchTeeTimes } = require('../services/platformService');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

/**
 * Create a new tee time
 * @route POST /api/tee-times
 * @access Public
 */
const createTeeTime = async (req, res, next) => {
  try {
    const { 
      booking_platform_id, 
      course_name, 
      date_time, 
      holes, 
      capacity, 
      total_cost, 
      booking_url 
    } = req.body;
    
    // Create tee time
    const teeTime = await TeeTime.create({
      booking_platform_id,
      course_name,
      date_time,
      holes,
      capacity,
      total_cost,
      booking_url
    });
    
    // Create a shareable token
    const token = jwt.sign(
      { teeTimeId: teeTime.id },
      process.env.JWT_TEE_TIME_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      teeTime: {
        id: teeTime.id,
        booking_platform_id: teeTime.booking_platform_id,
        course_name: teeTime.course_name,
        date_time: teeTime.date_time,
        holes: teeTime.holes,
        capacity: teeTime.capacity,
        total_cost: teeTime.total_cost,
        booking_url: teeTime.booking_url
      },
      shareToken: token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tee times
 * @route GET /api/tee-times
 * @access Private
 */
const getAllTeeTimes = async (req, res, next) => {
  try {
    // Parse query parameters
    const { 
      courseId, 
      platformId, 
      date, 
      minHoles, 
      maxHoles, 
      minPrice, 
      maxPrice,
      limit = 20,
      offset = 0
    } = req.query;
    
    // Build query conditions
    const where = {};
    
    if (courseId) {
      where.golf_course_id = courseId;
    }
    
    if (platformId) {
      where.booking_platform_id = platformId;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      where.date_time = {
        [Op.between]: [startDate, endDate]
      };
    }
    
    if (minHoles) {
      where.holes = {
        ...where.holes,
        [Op.gte]: minHoles
      };
    }
    
    if (maxHoles) {
      where.holes = {
        ...where.holes,
        [Op.lte]: maxHoles
      };
    }
    
    if (minPrice) {
      where.total_cost = {
        ...where.total_cost,
        [Op.gte]: minPrice
      };
    }
    
    if (maxPrice) {
      where.total_cost = {
        ...where.total_cost,
        [Op.lte]: maxPrice
      };
    }
    
    // Search for tee times
    let teeTimes = await TeeTime.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: BookingPlatform, as: 'bookingPlatform' }
      ],
      order: [['date_time', 'ASC']]
    });
    
    // If no results, try to search on platforms
    if (teeTimes.count === 0 && platformId) {
      const platformResults = await searchTeeTimes(platformId, {
        date,
        minHoles,
        maxHoles,
        minPrice,
        maxPrice
      });
      
      // Save results to database if found
      if (platformResults.length > 0) {
        await TeeTime.bulkCreate(platformResults);
        
        // Fetch the newly saved tee times
        teeTimes = await TeeTime.findAndCountAll({
          where,
          limit: parseInt(limit),
          offset: parseInt(offset),
          include: [
            { model: BookingPlatform, as: 'bookingPlatform' }
          ],
          order: [['date_time', 'ASC']]
        });
      }
    }
    
    res.status(200).json({
      success: true,
      count: teeTimes.count,
      data: teeTimes.rows.map(teeTime => ({
        id: teeTime.id,
        course_name: teeTime.course_name,
        date_time: teeTime.date_time,
        holes: teeTime.holes,
        capacity: teeTime.capacity,
        total_cost: teeTime.total_cost,
        booking_url: teeTime.booking_url,
        platform: teeTime.bookingPlatform ? {
          id: teeTime.bookingPlatform.id,
          name: teeTime.bookingPlatform.name
        } : null
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tee time by ID
 * @route GET /api/tee-times/:id
 * @access Public (with optional auth)
 */
const getTeeTimeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const teeTime = await TeeTime.findByPk(id, {
      include: [
        { model: BookingPlatform, as: 'bookingPlatform' }
      ]
    });
    
    if (!teeTime) {
      const error = new Error('Tee time not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check if user is authenticated
    const isAuthenticated = !!req.user;
    
    res.status(200).json({
      success: true,
      teeTime: {
        id: teeTime.id,
        course_name: teeTime.course_name,
        date_time: teeTime.date_time,
        holes: teeTime.holes,
        capacity: teeTime.capacity,
        total_cost: teeTime.total_cost,
        booking_url: teeTime.booking_url,
        platform: teeTime.bookingPlatform ? {
          id: teeTime.bookingPlatform.id,
          name: teeTime.bookingPlatform.name
        } : null
      },
      isAuthenticated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tee time by share token
 * @route GET /api/tee-times/token/:token
 * @access Public
 */
const getTeeTimeByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_TEE_TIME_SECRET);
    } catch (err) {
      const error = new Error('Invalid token');
      error.statusCode = 400;
      throw error;
    }
    
    const teeTime = await TeeTime.findByPk(decoded.teeTimeId, {
      include: [
        { model: BookingPlatform, as: 'bookingPlatform' }
      ]
    });
    
    if (!teeTime) {
      const error = new Error('Tee time not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      teeTime: {
        id: teeTime.id,
        course_name: teeTime.course_name,
        date_time: teeTime.date_time,
        holes: teeTime.holes,
        capacity: teeTime.capacity,
        total_cost: teeTime.total_cost,
        booking_url: teeTime.booking_url,
        platform: teeTime.bookingPlatform ? {
          id: teeTime.bookingPlatform.id,
          name: teeTime.bookingPlatform.name
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update tee time
 * @route PUT /api/tee-times/:id
 * @access Private
 */
const updateTeeTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      booking_platform_id, 
      course_name, 
      date_time, 
      holes, 
      capacity, 
      total_cost, 
      booking_url 
    } = req.body;
    
    let teeTime = await TeeTime.findByPk(id);
    
    if (!teeTime) {
      const error = new Error('Tee time not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Update fields
    if (booking_platform_id) teeTime.booking_platform_id = booking_platform_id;
    if (course_name) teeTime.course_name = course_name;
    if (date_time) teeTime.date_time = date_time;
    if (holes) teeTime.holes = holes;
    if (capacity) teeTime.capacity = capacity;
    if (total_cost) teeTime.total_cost = total_cost;
    if (booking_url) teeTime.booking_url = booking_url;
    
    // Save tee time
    await teeTime.save();
    
    // Fetch updated tee time with platform
    teeTime = await TeeTime.findByPk(id, {
      include: [
        { model: BookingPlatform, as: 'bookingPlatform' }
      ]
    });
    
    res.status(200).json({
      success: true,
      teeTime: {
        id: teeTime.id,
        course_name: teeTime.course_name,
        date_time: teeTime.date_time,
        holes: teeTime.holes,
        capacity: teeTime.capacity,
        total_cost: teeTime.total_cost,
        booking_url: teeTime.booking_url,
        platform: teeTime.bookingPlatform ? {
          id: teeTime.bookingPlatform.id,
          name: teeTime.bookingPlatform.name
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tee time
 * @route DELETE /api/tee-times/:id
 * @access Private
 */
const deleteTeeTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const teeTime = await TeeTime.findByPk(id);
    
    if (!teeTime) {
      const error = new Error('Tee time not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Delete tee time
    await teeTime.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Tee time deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeeTime,
  getAllTeeTimes,
  getTeeTimeById,
  getTeeTimeByToken,
  updateTeeTime,
  deleteTeeTime
}; 
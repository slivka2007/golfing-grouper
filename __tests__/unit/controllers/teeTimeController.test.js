const { TeeTime, BookingPlatform } = require('../../../src/models');
const teeTimeController = require('../../../src/controllers/teeTimeController');
const { searchTeeTimes } = require('../../../src/services/platformService');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Mock dependencies
jest.mock('../../../src/models', () => ({
  TeeTime: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    bulkCreate: jest.fn()
  },
  BookingPlatform: {}
}));

jest.mock('../../../src/services/platformService', () => ({
  searchTeeTimes: jest.fn()
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn()
}), { virtual: true });

// Mock sequelize
jest.mock('sequelize', () => ({
  Op: {
    between: Symbol('between'),
    gte: Symbol('gte'),
    lte: Symbol('lte')
  }
}), { virtual: true });

describe('Tee Time Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.JWT_TEE_TIME_SECRET = 'test-secret';
    jest.clearAllMocks();
  });

  describe('createTeeTime', () => {
    beforeEach(() => {
      req.body = {
        booking_platform_id: 1,
        course_name: 'Green Valley',
        date_time: '2023-06-01T08:30:00Z',
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123'
      };
    });

    it('should create a tee time successfully', async () => {
      // Mock tee time creation
      const mockTeeTime = {
        id: 1,
        booking_platform_id: 1,
        course_name: 'Green Valley',
        date_time: new Date('2023-06-01T08:30:00Z'),
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123'
      };
      TeeTime.create.mockResolvedValue(mockTeeTime);
      
      await teeTimeController.createTeeTime(req, res, next);

      // Verify correct responses
      expect(TeeTime.create).toHaveBeenCalledWith({
        booking_platform_id: 1,
        course_name: 'Green Valley',
        date_time: '2023-06-01T08:30:00Z',
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123'
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { teeTimeId: 1 },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        teeTime: {
          id: 1,
          booking_platform_id: 1,
          course_name: 'Green Valley',
          date_time: expect.any(Date),
          holes: 18,
          capacity: 4,
          total_cost: 120.00,
          booking_url: 'https://golfnow.com/teetimes/123'
        },
        shareToken: 'test-token'
      });
    });

    it('should handle errors during creation', async () => {
      // Mock a database error
      TeeTime.create.mockRejectedValue(new Error('Database error'));

      await teeTimeController.createTeeTime(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getTeeTimeById', () => {
    beforeEach(() => {
      req.params = { id: 1 };
      // For this test, assume authentication is optional
      req.user = null;
    });

    it('should return tee time if found', async () => {
      // Mock tee time found
      const mockTeeTime = {
        id: 1,
        course_name: 'Green Valley',
        date_time: new Date('2023-06-01T08:30:00Z'),
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123',
        bookingPlatform: {
          id: 1,
          name: 'GolfNow API'
        }
      };
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);

      await teeTimeController.getTeeTimeById(req, res, next);

      // Verify correct responses
      expect(TeeTime.findByPk).toHaveBeenCalledWith(1, {
        include: [
          { model: BookingPlatform, as: 'bookingPlatform' }
        ]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        teeTime: {
          id: 1,
          course_name: 'Green Valley',
          date_time: expect.any(Date),
          holes: 18,
          capacity: 4,
          total_cost: 120.00,
          booking_url: 'https://golfnow.com/teetimes/123',
          platform: {
            id: 1,
            name: 'GolfNow API'
          }
        },
        isAuthenticated: false
      });
    });

    it('should return 404 if tee time not found', async () => {
      // Mock tee time not found
      TeeTime.findByPk.mockResolvedValue(null);

      await teeTimeController.getTeeTimeById(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Tee time not found');
    });
    
    it('should indicate if user is authenticated', async () => {
      // Set up an authenticated user
      req.user = { id: 1 };
      
      // Mock tee time found
      const mockTeeTime = {
        id: 1,
        course_name: 'Green Valley',
        date_time: new Date('2023-06-01T08:30:00Z'),
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123',
        bookingPlatform: {
          id: 1,
          name: 'GolfNow API'
        }
      };
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);

      await teeTimeController.getTeeTimeById(req, res, next);

      // Verify isAuthenticated is true
      expect(res.json.mock.calls[0][0].isAuthenticated).toBe(true);
    });
  });

  describe('getAllTeeTimes', () => {
    it('should return tee times with basic filtering', async () => {
      // Set up query parameters
      req.query = {
        limit: 10,
        offset: 0
      };
      
      // Mock database response
      const mockTeeTimes = {
        count: 2,
        rows: [
          {
            id: 1,
            course_name: 'Green Valley',
            date_time: new Date('2023-06-01T08:30:00Z'),
            holes: 18,
            capacity: 4,
            total_cost: 120.00,
            booking_url: 'https://golfnow.com/teetimes/123',
            bookingPlatform: {
              id: 1,
              name: 'GolfNow API'
            }
          },
          {
            id: 2,
            course_name: 'Blue Mountain',
            date_time: new Date('2023-06-01T09:30:00Z'),
            holes: 9,
            capacity: 2,
            total_cost: 80.00,
            booking_url: 'https://golfnow.com/teetimes/456',
            bookingPlatform: {
              id: 1,
              name: 'GolfNow API'
            }
          }
        ]
      };
      TeeTime.findAndCountAll.mockResolvedValue(mockTeeTimes);

      await teeTimeController.getAllTeeTimes(req, res, next);

      // Verify database query and response
      expect(TeeTime.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        include: [{ model: BookingPlatform, as: 'bookingPlatform' }],
        order: [['date_time', 'ASC']]
      });
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            course_name: 'Green Valley'
          }),
          expect.objectContaining({
            id: 2,
            course_name: 'Blue Mountain'
          })
        ])
      });
    });

    it('should apply complex filtering', async () => {
      // Set up query parameters
      req.query = {
        courseId: 1,
        platformId: 2,
        date: '2023-06-01',
        minHoles: 9,
        maxHoles: 18,
        minPrice: 50,
        maxPrice: 150
      };
      
      // Mock database response
      const mockTeeTimes = {
        count: 1,
        rows: [
          {
            id: 1,
            course_name: 'Green Valley',
            date_time: new Date('2023-06-01T08:30:00Z'),
            holes: 18,
            capacity: 4,
            total_cost: 120.00,
            booking_url: 'https://golfnow.com/teetimes/123',
            bookingPlatform: {
              id: 2,
              name: 'TeeOff API'
            }
          }
        ]
      };
      TeeTime.findAndCountAll.mockResolvedValue(mockTeeTimes);

      await teeTimeController.getAllTeeTimes(req, res, next);

      // Verify where clause contains all filters
      const callArgs = TeeTime.findAndCountAll.mock.calls[0][0];
      expect(callArgs.where.golf_course_id).toBe(1);
      expect(callArgs.where.booking_platform_id).toBe(2);
      expect(callArgs.where.date_time).toBeDefined();
      expect(callArgs.where.holes).toBeDefined();
      expect(callArgs.where.total_cost).toBeDefined();
    });

    it('should fetch from external platforms if no results found', async () => {
      // Set up query parameters
      req.query = {
        platformId: 2,
        date: '2023-06-01'
      };
      
      // Mock empty initial results
      TeeTime.findAndCountAll.mockResolvedValueOnce({
        count: 0,
        rows: []
      });
      
      // Mock platform search results
      const platformResults = [
        {
          booking_platform_id: 2,
          course_name: 'External Course',
          date_time: new Date('2023-06-01T10:00:00Z'),
          holes: 18,
          capacity: 4,
          total_cost: 150.00,
          booking_url: 'https://external.com/tee/123'
        }
      ];
      searchTeeTimes.mockResolvedValue(platformResults);
      
      // Mock second database call after saving results
      const mockTeeTimesAfterSave = {
        count: 1,
        rows: [
          {
            id: 3,
            booking_platform_id: 2,
            course_name: 'External Course',
            date_time: new Date('2023-06-01T10:00:00Z'),
            holes: 18,
            capacity: 4,
            total_cost: 150.00,
            booking_url: 'https://external.com/tee/123',
            bookingPlatform: {
              id: 2,
              name: 'TeeOff API'
            }
          }
        ]
      };
      TeeTime.findAndCountAll.mockResolvedValueOnce(mockTeeTimesAfterSave);

      await teeTimeController.getAllTeeTimes(req, res, next);

      // Verify external search was called
      expect(searchTeeTimes).toHaveBeenCalledWith(2, {
        date: '2023-06-01',
        minHoles: undefined,
        maxHoles: undefined,
        minPrice: undefined,
        maxPrice: undefined
      });
      
      // Verify results were saved and second query was made
      expect(TeeTime.bulkCreate).toHaveBeenCalledWith(platformResults);
      expect(TeeTime.findAndCountAll).toHaveBeenCalledTimes(2);
      
      // Verify final response
      expect(res.json.mock.calls[0][0].count).toBe(1);
      expect(res.json.mock.calls[0][0].data[0].course_name).toBe('External Course');
    });

    it('should handle errors', async () => {
      // Mock database error
      TeeTime.findAndCountAll.mockRejectedValue(new Error('Database error'));

      await teeTimeController.getAllTeeTimes(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getTeeTimeByToken', () => {
    beforeEach(() => {
      req.params = { token: 'valid-token' };
    });

    it('should return tee time if token is valid', async () => {
      // Mock token verification
      jwt.verify.mockReturnValue({ teeTimeId: 1 });
      
      // Mock tee time found
      const mockTeeTime = {
        id: 1,
        course_name: 'Green Valley',
        date_time: new Date('2023-06-01T08:30:00Z'),
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123',
        bookingPlatform: {
          id: 1,
          name: 'GolfNow API'
        }
      };
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);

      await teeTimeController.getTeeTimeByToken(req, res, next);

      // Verify token verification
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      
      // Verify tee time lookup
      expect(TeeTime.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: BookingPlatform, as: 'bookingPlatform' }]
      });
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        teeTime: expect.objectContaining({
          id: 1,
          course_name: 'Green Valley',
          platform: expect.objectContaining({
            id: 1,
            name: 'GolfNow API'
          })
        })
      });
    });

    it('should return 400 if token is invalid', async () => {
      // Mock token verification failure
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await teeTimeController.getTeeTimeByToken(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe('Invalid token');
    });

    it('should return 404 if tee time not found', async () => {
      // Mock token verification
      jwt.verify.mockReturnValue({ teeTimeId: 999 });
      
      // Mock tee time not found
      TeeTime.findByPk.mockResolvedValue(null);

      await teeTimeController.getTeeTimeByToken(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Tee time not found');
    });
  });

  describe('updateTeeTime', () => {
    beforeEach(() => {
      req.params = { id: 1 };
      req.body = {
        course_name: 'Updated Course Name',
        total_cost: 150.00
      };
    });

    it('should update tee time successfully', async () => {
      // Mock initial tee time lookup
      const mockTeeTime = {
        id: 1,
        booking_platform_id: 1,
        course_name: 'Green Valley',
        date_time: new Date('2023-06-01T08:30:00Z'),
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123',
        save: jest.fn().mockResolvedValue(true)
      };
      TeeTime.findByPk.mockResolvedValueOnce(mockTeeTime);
      
      // Mock tee time after update
      const updatedTeeTime = {
        ...mockTeeTime,
        course_name: 'Updated Course Name',
        total_cost: 150.00,
        bookingPlatform: {
          id: 1,
          name: 'GolfNow API'
        }
      };
      TeeTime.findByPk.mockResolvedValueOnce(updatedTeeTime);

      await teeTimeController.updateTeeTime(req, res, next);

      // Verify fields were updated
      expect(mockTeeTime.course_name).toBe('Updated Course Name');
      expect(mockTeeTime.total_cost).toBe(150.00);
      expect(mockTeeTime.save).toHaveBeenCalled();
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        teeTime: expect.objectContaining({
          id: 1,
          course_name: 'Updated Course Name',
          total_cost: 150.00
        })
      });
    });

    it('should return 404 if tee time not found', async () => {
      // Mock tee time not found
      TeeTime.findByPk.mockResolvedValue(null);

      await teeTimeController.updateTeeTime(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Tee time not found');
    });

    it('should handle save errors', async () => {
      // Mock tee time but with save error
      const mockTeeTime = {
        id: 1,
        save: jest.fn().mockRejectedValue(new Error('Save error'))
      };
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);

      await teeTimeController.updateTeeTime(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteTeeTime', () => {
    beforeEach(() => {
      req.params = { id: 1 };
    });

    it('should delete tee time successfully', async () => {
      // Mock tee time with destroy method
      const mockTeeTime = {
        id: 1,
        course_name: 'Green Valley',
        destroy: jest.fn().mockResolvedValue(true)
      };
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);

      await teeTimeController.deleteTeeTime(req, res, next);

      // Verify destroy was called
      expect(mockTeeTime.destroy).toHaveBeenCalled();
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tee time deleted'
      });
    });

    it('should return 404 if tee time not found', async () => {
      // Mock tee time not found
      TeeTime.findByPk.mockResolvedValue(null);

      await teeTimeController.deleteTeeTime(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Tee time not found');
    });

    it('should handle destroy errors', async () => {
      // Mock tee time but with destroy error
      const mockTeeTime = {
        id: 1,
        destroy: jest.fn().mockRejectedValue(new Error('Destroy error'))
      };
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);

      await teeTimeController.deleteTeeTime(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}); 
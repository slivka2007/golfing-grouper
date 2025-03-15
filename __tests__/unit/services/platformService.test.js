const axios = require('axios');
const { searchTeeTimes, bookTeeTime } = require('../../../src/services/platformService');
const { BookingPlatform, TeeTime } = require('../../../src/models');

// Mock dependencies
jest.mock('axios', () => ({
  create: jest.fn()
}), { virtual: true });

jest.mock('../../../src/models', () => ({
  BookingPlatform: {
    findByPk: jest.fn()
  },
  TeeTime: {
    findByPk: jest.fn()
  }
}));

describe('Platform Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchTeeTimes', () => {
    it('should search for tee times from GolfNow platform', async () => {
      // Setup mocks
      const mockPlatform = {
        id: 1,
        name: 'GolfNow API',
        api_endpoint: 'https://api.golfnow.com',
        api_key: 'test-api-key'
      };
      
      BookingPlatform.findByPk.mockResolvedValue(mockPlatform);
      
      const mockApiResponse = {
        data: {
          tee_times: [
            {
              course: { name: 'Green Valley' },
              date_time: '2023-06-01T08:30:00Z',
              holes: 18,
              player_count: 4,
              rate: { total_price: 120.00 },
              booking_url: 'https://golfnow.com/teetimes/123'
            },
            {
              course: { name: 'Blue Mountain' },
              date_time: '2023-06-01T09:30:00Z',
              holes: 9,
              player_count: 2,
              rate: { total_price: 80.00 },
              booking_url: 'https://golfnow.com/teetimes/456'
            }
          ]
        }
      };
      
      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockApiResponse)
      });
      
      const searchParams = {
        date: '2023-06-01',
        minHoles: 9,
        maxHoles: 18
      };
      
      // Call function
      const result = await searchTeeTimes(1, searchParams);
      
      // Verify behavior
      expect(BookingPlatform.findByPk).toHaveBeenCalledWith(1);
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.golfnow.com',
        timeout: 10000,
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // Verify mapping
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        booking_platform_id: 1,
        course_name: 'Green Valley',
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123'
      });
      expect(result[1]).toMatchObject({
        booking_platform_id: 1,
        course_name: 'Blue Mountain',
        holes: 9,
        capacity: 2,
        total_cost: 80.00,
        booking_url: 'https://golfnow.com/teetimes/456'
      });
    });

    it('should search for tee times from TeeOff platform', async () => {
      // Setup mocks
      const mockPlatform = {
        id: 2,
        name: 'TeeOff API',
        api_endpoint: 'https://api.teeoff.com',
        api_key: 'test-api-key'
      };
      
      BookingPlatform.findByPk.mockResolvedValue(mockPlatform);
      
      const mockApiResponse = {
        data: {
          availableTimes: [
            {
              courseName: 'Highland Hills',
              date: '2023-06-01',
              time: '10:00:00',
              holes: 18,
              maxPlayers: 4,
              pricePerPlayer: 45.00,
              id: 'T123'
            },
            {
              courseName: 'River Links',
              date: '2023-06-01',
              time: '10:30:00',
              holes: 18,
              maxPlayers: 4,
              pricePerPlayer: 50.00,
              id: 'T456'
            }
          ]
        }
      };
      
      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockApiResponse)
      });
      
      const searchParams = {
        date: '2023-06-01',
        minHoles: 18
      };
      
      // Call function
      const result = await searchTeeTimes(2, searchParams);
      
      // Verify behavior
      expect(BookingPlatform.findByPk).toHaveBeenCalledWith(2);
      
      // Verify mapping
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        booking_platform_id: 2,
        course_name: 'Highland Hills',
        holes: 18,
        capacity: 4,
        total_cost: 180.00, // 45 * 4
        booking_url: 'https://api.teeoff.com/book/T123'
      });
      expect(result[1]).toMatchObject({
        booking_platform_id: 2,
        course_name: 'River Links',
        holes: 18,
        capacity: 4,
        total_cost: 200.00, // 50 * 4
        booking_url: 'https://api.teeoff.com/book/T456'
      });
    });

    it('should handle platform not found', async () => {
      BookingPlatform.findByPk.mockResolvedValue(null);
      
      await expect(searchTeeTimes(999, {})).rejects.toThrow(
        'Platform not found or API endpoint not configured'
      );
    });

    it('should handle API error', async () => {
      // Setup mocks
      const mockPlatform = {
        id: 1,
        name: 'GolfNow API',
        api_endpoint: 'https://api.golfnow.com',
        api_key: 'test-api-key'
      };
      
      BookingPlatform.findByPk.mockResolvedValue(mockPlatform);
      
      axios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('API connection failed'))
      });
      
      await expect(searchTeeTimes(1, {})).rejects.toThrow(
        'API search failed: API connection failed'
      );
    });
  });

  describe('bookTeeTime', () => {
    it('should book a tee time on GolfNow platform', async () => {
      // Setup mocks
      const mockPlatform = {
        id: 1,
        name: 'GolfNow API',
        api_endpoint: 'https://api.golfnow.com',
        api_key: 'test-api-key'
      };
      
      const mockTeeTime = {
        id: 123,
        booking_platform_id: 1,
        course_name: 'Green Valley',
        date_time: new Date('2023-06-01T08:30:00Z'),
        holes: 18,
        capacity: 4,
        total_cost: 120.00,
        booking_url: 'https://golfnow.com/teetimes/123',
        bookingPlatform: mockPlatform
      };
      
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);
      
      const mockApiResponse = {
        data: {
          confirmation_code: 'GN12345',
          booking_details: {
            tee_time: {
              course: 'Green Valley',
              date_time: '2023-06-01T08:30:00Z'
            },
            players: [
              { name: 'John Doe' },
              { name: 'Jane Smith' }
            ],
            payment: {
              amount: 120.00,
              status: 'completed'
            }
          }
        }
      };
      
      axios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockApiResponse)
      });
      
      const bookingDetails = {
        playerCount: 2,
        players: [
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          },
          {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com'
          }
        ],
        paymentMethodId: 'pm_123456'
      };
      
      // Call function
      const result = await bookTeeTime(123, bookingDetails);
      
      // Verify behavior
      expect(TeeTime.findByPk).toHaveBeenCalledWith(123, {
        include: [{ model: BookingPlatform, as: 'bookingPlatform' }]
      });
      
      // Verify booking data formatting
      const axiosPostMock = axios.create.mock.results[0].value.post;
      expect(axiosPostMock).toHaveBeenCalledWith('/bookings', {
        tee_time_id: 123,
        player_count: 2,
        players: [
          {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com'
          },
          {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane@example.com'
          }
        ],
        payment: {
          payment_method_id: 'pm_123456'
        }
      });
      
      // Verify response
      expect(result).toEqual({
        success: true,
        confirmation_code: 'GN12345',
        booking_details: mockApiResponse.data
      });
    });

    it('should handle tee time not found', async () => {
      TeeTime.findByPk.mockResolvedValue(null);
      
      await expect(bookTeeTime(999, {})).rejects.toThrow(
        'Tee time not found'
      );
    });

    it('should handle booking API error', async () => {
      // Setup mocks
      const mockPlatform = {
        id: 1,
        name: 'GolfNow API',
        api_endpoint: 'https://api.golfnow.com',
        api_key: 'test-api-key'
      };
      
      const mockTeeTime = {
        id: 123,
        booking_platform_id: 1,
        bookingPlatform: mockPlatform
      };
      
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);
      
      axios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('Payment failed'))
      });
      
      // Provide a valid bookingDetails object to avoid undefined.map errors
      const bookingDetails = {
        playerCount: 2,
        players: [
          { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
        ],
        paymentMethodId: 'pm_123'
      };
      
      await expect(bookTeeTime(123, bookingDetails)).rejects.toThrow(
        'Booking failed: Payment failed'
      );
    });

    it('should throw error for unsupported platform', async () => {
      // Setup mocks
      const mockPlatform = {
        id: 3,
        name: 'Unsupported Platform',
        api_endpoint: 'https://api.unsupported.com',
        api_key: 'test-api-key'
      };
      
      const mockTeeTime = {
        id: 123,
        booking_platform_id: 3,
        bookingPlatform: mockPlatform
      };
      
      TeeTime.findByPk.mockResolvedValue(mockTeeTime);
      
      axios.create.mockReturnValue({
        post: jest.fn()
      });
      
      await expect(bookTeeTime(123, {})).rejects.toThrow(
        'No booking format defined for platform: Unsupported Platform'
      );
    });
  });
}); 
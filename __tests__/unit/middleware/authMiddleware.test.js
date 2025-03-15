const { authMiddleware, optionalAuthMiddleware } = require('../../../src/middleware/authMiddleware');
const { User } = require('../../../src/models');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../../src/models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}), { virtual: true });

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {};
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should authenticate user with valid token', async () => {
      // Setup mock token
      req.headers.authorization = 'Bearer validtoken';
      
      // Mock token verification
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      
      // Mock user
      const mockUser = { id: 1, email: 'test@example.com' };
      User.findByPk.mockResolvedValue(mockUser);
      
      await authMiddleware(req, res, next);
      
      // Verify behavior
      expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'test-secret');
      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ['password_hash'] }
      });
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it('should return 401 if no token provided', async () => {
      req.headers.authorization = undefined;
      
      await authMiddleware(req, res, next);
      
      // Verify error handling
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Not authorized, no token');
    });

    it('should return 401 if token verification fails', async () => {
      req.headers.authorization = 'Bearer invalidtoken';
      
      // Mock token verification to fail
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await authMiddleware(req, res, next);
      
      // Verify error handling
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Not authorized, token failed');
    });

    it('should return 401 if user not found', async () => {
      req.headers.authorization = 'Bearer validtoken';
      
      // Mock token verification
      jwt.verify.mockReturnValue({ id: 999, email: 'nonexistent@example.com' });
      
      // Mock user not found
      User.findByPk.mockResolvedValue(null);
      
      await authMiddleware(req, res, next);
      
      // Verify error handling
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Not authorized, token failed');
    });
  });

  describe('optionalAuthMiddleware', () => {
    it('should authenticate user with valid token', async () => {
      // Setup mock token
      req.headers.authorization = 'Bearer validtoken';
      
      // Mock token verification
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      
      // Mock user
      const mockUser = { id: 1, email: 'test@example.com' };
      User.findByPk.mockResolvedValue(mockUser);
      
      await optionalAuthMiddleware(req, res, next);
      
      // Verify behavior - user should be set but always call next
      expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'test-secret');
      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ['password_hash'] }
      });
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should continue without user if no token provided', async () => {
      req.headers.authorization = undefined;
      
      await optionalAuthMiddleware(req, res, next);
      
      // Should just continue without user
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should continue without user if token verification fails', async () => {
      req.headers.authorization = 'Bearer invalidtoken';
      
      // Mock token verification to fail
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await optionalAuthMiddleware(req, res, next);
      
      // Should just continue without user
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
}); 
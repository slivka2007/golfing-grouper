const { User } = require('../../../src/models');
const userController = require('../../../src/controllers/userController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Mock dependencies
jest.mock('../../../src/models', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  }
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn()
}), { virtual: true });

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn()
}), { virtual: true });

describe('User Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    beforeEach(() => {
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        zip5: '12345',
        golfExperience: 'beginner',
        handicap: '10',
        averageScore: '85'
      };
    });

    it('should register a new user successfully', async () => {
      // Mock user not found (email doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Mock user creation
      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        getSignedJwtToken: jest.fn().mockReturnValue('test-token')
      };
      User.create.mockResolvedValue(mockUser);

      await userController.registerUser(req, res, next);

      // Verify correct responses
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(User.create).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password_hash: 'password123',
        zip_5: '12345',
        golf_experience: 'beginner',
        handicap: '10',
        average_score: '85',
        preferences: {}
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'test-token',
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      });
    });

    it('should return 400 if user already exists', async () => {
      // Mock user found (email exists)
      User.findOne.mockResolvedValue({ id: 1, email: 'john@example.com' });

      await userController.registerUser(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('User already exists');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should handle exceptions', async () => {
      // Mock a database error
      User.findOne.mockRejectedValue(new Error('Database error'));

      await userController.registerUser(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('loginUser', () => {
    beforeEach(() => {
      req.body = {
        email: 'john@example.com',
        password: 'password123'
      };
    });

    it('should login a user successfully', async () => {
      // Mock user found
      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        matchPassword: jest.fn().mockResolvedValue(true),
        getSignedJwtToken: jest.fn().mockReturnValue('test-token')
      };
      User.findOne.mockResolvedValue(mockUser);

      await userController.loginUser(req, res, next);

      // Verify correct responses
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(mockUser.matchPassword).toHaveBeenCalledWith('password123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'test-token',
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      });
    });

    it('should return 401 if user not found', async () => {
      // Mock user not found
      User.findOne.mockResolvedValue(null);

      await userController.loginUser(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Invalid credentials');
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    it('should return 401 if password invalid', async () => {
      // Mock user found but password doesn't match
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        matchPassword: jest.fn().mockResolvedValue(false)
      };
      User.findOne.mockResolvedValue(mockUser);

      await userController.loginUser(req, res, next);

      // Error should be passed to next middleware
      expect(mockUser.matchPassword).toHaveBeenCalledWith('password123');
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Invalid credentials');
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });
  });

  describe('getCurrentUser', () => {
    beforeEach(() => {
      req.user = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        zip_5: '12345',
        golf_experience: 'beginner',
        handicap: '10',
        average_score: '85'
      };
    });

    it('should return current user', async () => {
      await userController.getCurrentUser(req, res, next);

      // Verify correct responses
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          zip5: '12345',
          golfExperience: 'beginner',
          handicap: '10',
          averageScore: '85'
        }
      });
    });
  });

  describe('updateCurrentUser', () => {
    beforeEach(() => {
      req.user = { id: 1 };
      req.body = {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com'
      };
    });

    it('should update user successfully', async () => {
      // Mock user found
      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        save: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.updateCurrentUser(req, res, next);

      // Verify correct responses
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.first_name).toBe('Updated');
      expect(mockUser.last_name).toBe('User');
      expect(mockUser.email).toBe('updated@example.com');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getUserPreferences', () => {
    beforeEach(() => {
      req.user = { id: 1 };
    });

    it('should return user preferences', async () => {
      // Mock user found
      const mockUser = {
        id: 1,
        preferences: { roundType: '18 holes', pace: 'fast' }
      };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.getUserPreferences(req, res, next);

      // Verify correct responses
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        preferences: { roundType: '18 holes', pace: 'fast' }
      });
    });
  });

  describe('updateUserPreferences', () => {
    beforeEach(() => {
      req.user = { id: 1 };
      req.body = {
        preferences: { roundType: '9 holes', pace: 'casual' }
      };
    });

    it('should update user preferences', async () => {
      // Mock user found
      const mockUser = {
        id: 1,
        preferences: { roundType: '18 holes', pace: 'fast' },
        save: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.updateUserPreferences(req, res, next);

      // Verify correct responses
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.preferences).toEqual({ roundType: '9 holes', pace: 'casual' });
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        preferences: { roundType: '9 holes', pace: 'casual' }
      });
    });
  });

  describe('forgotPassword', () => {
    beforeEach(() => {
      req.body = {
        email: 'john@example.com'
      };
    });

    it('should generate a reset token if user exists', async () => {
      // Mock user found
      const mockUser = {
        id: 1,
        email: 'john@example.com'
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('reset-token-123');

      await userController.forgotPassword(req, res, next);

      // Verify correct responses
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1 },
        process.env.JWT_RESET_SECRET,
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Reset token generated',
        resetToken: 'reset-token-123'
      });
    });

    it('should not reveal if user does not exist', async () => {
      // Mock user not found
      User.findOne.mockResolvedValue(null);

      await userController.forgotPassword(req, res, next);

      // Verify correct responses - shouldn't reveal user doesn't exist
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'If the email exists, a reset token will be sent'
      });
    });
  });

  describe('resetPassword', () => {
    beforeEach(() => {
      req.params = {
        resetToken: 'reset-token-123'
      };
      req.body = {
        password: 'newpassword123'
      };
    });

    it('should reset password successfully', async () => {
      // Mock token verification
      jwt.verify.mockReturnValue({ id: 1 });

      // Mock user found
      const mockUser = {
        id: 1,
        password_hash: 'old-hash',
        save: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.resetPassword(req, res, next);

      // Verify correct responses
      expect(jwt.verify).toHaveBeenCalledWith('reset-token-123', process.env.JWT_RESET_SECRET);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.password_hash).toBe('newpassword123');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset successful'
      });
    });

    it('should handle invalid token', async () => {
      // Mock token verification failure
      jwt.verify.mockImplementation(() => {
        const error = new Error('Invalid token');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      await userController.resetPassword(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Invalid token');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should handle user not found', async () => {
      // Mock token verification
      jwt.verify.mockReturnValue({ id: 999 });

      // Mock user not found
      User.findByPk.mockResolvedValue(null);

      await userController.resetPassword(req, res, next);

      // Error should be passed to next middleware
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Invalid token');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });
  });
}); 
// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRE = '1h';
process.env.JWT_RESET_SECRET = 'test-reset-secret';
process.env.JWT_TEE_TIME_SECRET = 'test-tee-time-secret';

// Increase timeout for tests
jest.setTimeout(10000);

// Suppress console output during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 
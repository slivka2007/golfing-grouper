# GolfingGrouper Tests

This directory contains automated tests for the GolfingGrouper application.

## Test Structure

The tests are organized as follows:

```
__tests__/
├── unit/                  # Unit tests
│   ├── controllers/       # Controller tests
│   ├── middleware/        # Middleware tests
│   ├── models/            # Model tests
│   └── services/          # Service tests
├── integration/           # Integration tests
└── e2e/                   # End-to-end tests
```

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run specific test categories
npm run test:controllers
npm run test:services
npm run test:middleware
```

## Docker Testing

You can also run the tests in a Docker container:

```bash
# Run tests in Docker
npm run docker:test
```

## Test Coverage

The test coverage thresholds are configured in `jest.config.js`. The current thresholds are:

- Statements: 60%
- Branches: 40%
- Functions: 60%
- Lines: 60%

## Writing Tests

When writing new tests, follow these guidelines:

1. **Unit Tests**: Test individual functions and methods in isolation
2. **Mocking**: Use Jest's mocking capabilities to mock dependencies
3. **Naming**: Name test files with the `.test.js` suffix
4. **Structure**: Use `describe` and `it` blocks to organize tests
5. **Assertions**: Use Jest's assertion functions to verify results

### Example Test Structure

```javascript
describe('Component Name', () => {
  beforeEach(() => {
    // Setup code
  });

  afterEach(() => {
    // Cleanup code
  });

  describe('Function Name', () => {
    it('should do something specific', () => {
      // Test code
      expect(result).toBe(expectedValue);
    });

    it('should handle error cases', () => {
      // Test error handling
      expect(() => functionCall()).toThrow();
    });
  });
});
```

## Mocking Dependencies

For unit tests, you should mock external dependencies. Here's an example:

```javascript
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
```

## Environment Variables

Test-specific environment variables are set in `jest.setup.js`. 
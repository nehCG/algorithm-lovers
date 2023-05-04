const authMiddleware = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('config');

// Mock console.error to suppress output during testing
console.error = jest.fn();

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    req.header.mockReturnValue(null);

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'No token, authorization denied' });
  });

  it('should return 401 if token is not valid', () => {
    const token = 'invalid-token';
    req.header.mockReturnValue(token);
    jwt.verify.mockImplementationOnce((_, __, cb) => cb(new Error('invalid token')));

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, config.get('jwtSecret'), expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Token is not valid' });
  });

  it('should call next() if token is valid', () => {
    const token = 'valid-token';
    const decodedUser = { id: 'user-id' };
    req.header.mockReturnValue(token);
    jwt.verify.mockImplementationOnce((_, __, cb) => cb(null, { user: decodedUser }));

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, config.get('jwtSecret'), expect.any(Function));
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
  });

  it('should return 500 if an error occurs during token verification', () => {
    const token = 'error-token';
    req.header.mockReturnValue(token);
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('Server Error');
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, config.get('jwtSecret'), expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Server Error' });
  });
});

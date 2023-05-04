import request from 'supertest';
const request = require('supertest');
const app = require('../app');
const server = require('../server')
const mongoose = require('mongoose');

// Mock console.log to suppress output during testing
console.log = jest.fn();

// unit test for auth.js
describe('Auth API', () => {
  let authToken;

  describe('POST /api/auth', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Please include a valid email');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({
          email: 'test@example.com'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Password is required');
    });

    it('should return 400 if email or password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Invalid Credentials');
    });

    it('should return a token if email and password are correct', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({
          email: 'cg3356@columbia.edu',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();

      authToken = res.body.token;
    });
  });

  describe('GET /api/auth', () => {
    it('should return 401 if no auth token is provided', async () => {
      const res = await request(app)
        .get('/api/auth');

      expect(res.status).toBe(401);
    });

    it('should return the authenticated user if a valid auth token is provided', async () => {
      const res = await request(app)
        .get('/api/auth')
        .set('x-auth-token', authToken);

      expect(res.status).toBe(200);
      expect(res.body._id).toBeDefined();
      expect(res.body.email).toBe('cg3356@columbia.edu');
      expect(res.body.password).toBeUndefined();
    });

    it('should return 401 if an invalid auth token is provided', async () => {
      const invalidAuthToken = authToken + 'some-invalid-data';

      const res = await request(app)
        .get('/api/auth')
        .set('x-auth-token', invalidAuthToken);

      expect(res.status).toBe(401);
      expect(res.body.msg).toBe('Token is not valid');
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
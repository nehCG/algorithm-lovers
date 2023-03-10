const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const connectDB = require('../config/db')

// Nine unit tests, all passed

describe('GET /', () => {
    test('should return "API Running"', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('API Running');
    });
});

describe('GET /', () => {
    test('should return "Posts route"', async () => {
        const response = await request(app).get('/api/posts');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Posts route');
    });
});

describe('GET /', () => {
    test('should return "Profile route"', async () => {
        const response = await request(app).get('/api/profile');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Profile route');
    });
});

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
    });
  });


// One integration test, passed

describe('POST /', () => {

  beforeAll(async () => {
    await connectDB();
    let user;
    user = await User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await bcrypt.hash('password123', 10)
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'johndoe@example.com' });
    await mongoose.disconnect();
  });

  test('should return 400 and validation errors if request body is invalid', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: '', email: 'invalidemail', password: '123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toHaveLength(3);
  });

  test('should return 400 and error message if user already exists', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'johndoe@example.com', password: 'password123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('User already exists');
  });

  test('should create a new user, hash password, and return a JWT', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe', email: 'janedoe@example.com', password: 'password456' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    const decoded = jwt.verify(response.body.token, config.get('jwtSecret'));
    expect(decoded.user.id).toBeDefined();

    const createdUser = await User.findOne({ email: 'janedoe@example.com' });
    expect(createdUser).toBeDefined();
    expect(await bcrypt.compare('password456', createdUser.password)).toBe(true);
  });
});

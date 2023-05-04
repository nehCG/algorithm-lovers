import request from 'supertest';
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const connectDB = require('../config/db')

describe('POST /', () => {
  let user;
  beforeAll(async () => {
    await connectDB();
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
    let createdUser;
    try {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Jane Doe', email: 'janedoe2@example.com', password: 'password456' });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();

      const decoded = jwt.verify(response.body.token, config.get('jwtSecret'));
      expect(decoded.user.id).toBeDefined();

      createdUser = await User.findOne({ email: 'janedoe2@example.com' });
      expect(createdUser).toBeDefined();
      expect(await bcrypt.compare('password456', createdUser.password)).toBe(true);
    } finally {
      if (createdUser) {
        await User.deleteOne({ email: 'janedoe2@example.com' });
      }
    }
  });

  test('should return 500 and server error message if an error occurs during user creation', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    try {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Jane Doe', email: 'janedoe2@example.com', password: 'password456' });

      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Server error');

      // Restore the original method after the test
      User.findOne.mockRestore();
      console.error = originalConsoleError;
    } finally {
      await User.deleteOne({ email: 'janedoe2@example.com' });
    }
  });

  test('should return 500 and server error message if jwt.sign produces an error', async () => {
    // Mock console.error to suppress output during test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const originalJwtSign = jwt.sign;
    jwt.sign = jest.fn((_, __, ___, callback) => {
      callback(new Error('Test error'), null);
    });
    try {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Jane Doe', email: 'janedoe2@example.com', password: 'password456' });

      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Server error');

      // Restore the original methods after the test
      jwt.sign = originalJwtSign;
      console.error = originalConsoleError;
    } finally {
      await User.deleteOne({ email: 'janedoe2@example.com' });
    }
  });
});

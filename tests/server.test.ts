const request = require('supertest');
const app = require('../src/app');
const server = require('../src/server')
const mongoose = require('mongoose');

// unit test for app.js
describe('GET /', () => {
  test('should return "API Running"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('API Running');
  });
});

// unit test for server.js
describe('App listening', () => {
  afterAll((done) => {
    server.close(done);
  });

  test('Server started on port 6000', () => {
    expect(server.address().port).toBe(6000);
  });

  test('GET / should return 200 status', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

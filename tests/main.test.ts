const request = require('supertest');
const app = require('../app');

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
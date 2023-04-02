import request from 'supertest';
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db')
const auth = require('../src/middleware/auth')
const Post = require('../src/models/Post')

jest.mock('../src/middleware/auth')

//
// Test POST /api/posts
//
describe('POST /api/posts', () => {
  let user;
  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
    await Post.deleteMany({});
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('create a post with valid text', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({ text: 'This is a test post' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.text).toBe('This is a test post');
  });

  test('should return 400 if text is empty', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Text is required');
  });
});


//
// Test GET /api/posts
//
describe('GET /api/posts', () => {
  let user;
  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
    await Post.deleteMany({});
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('get all posts', async () => {
    const postData = [
      { text: 'Test post', user: user._id },
      { text: 'Test post', user: user._id },
    ];
    await Post.create(postData);

    const response = await request(app).get('/api/posts');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].text).toBe('Test post');
    expect(response.body[1].text).toBe('Test post');
  });

  test('should return 500 if server error occurs', async () => {
    jest.spyOn(Post, 'find').mockImplementationOnce(() => {
      throw new Error('Server Error');
    });

    const response = await request(app)
      .get('/api/posts')
      .send();

    expect(response.status).toBe(500);
    expect(response.text).toEqual('Server Error');
  });
});


//
// Test GET api/posts/:id
//
describe('GET api/posts/:id', () => {
  let user;
  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
    await Post.deleteMany({});
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('get post by ID', async () => {
    const post = await Post.create({ text: 'Test post', user: user._id });

    const response = await request(app).get(`/api/posts/${post._id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(post._id.toString());
    expect(response.body.text).toBe('Test post');
  });

  test('get post by ID - not found', async () => {
    const nonExistentId = mongoose.Types.ObjectId();

    const response = await request(app).get(`/api/posts/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Post not found');
  });

  test('get post by ID - invalid ID', async () => {
    const invalidId = '123';

    const response = await request(app).get(`/api/posts/${invalidId}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Post not found');
  });
});


//
// Test DELETE /api/posts/:id
//
describe('DELETE /api/posts/:id', () => {
  let user, post;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
    await Post.deleteMany({});

    post = await Post.create({
      text: 'Test post',
      user: user._id,
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  // test('should delete post if user is authorized', async () => {
  //   const response = await request(app)
  //     .delete(`/api/posts/${post._id}`)
  //     .send();

  //   console.log('Delete Response: ', response.body); // Add this line

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({ msg: 'Post removed' });
  // });

  test('should return 404 if the post is not found', async () => {
    const nonExistentPostId = '605d1da334312a27e4b4b4aa';
    const response = await request(app)
      .delete(`/api/posts/${nonExistentPostId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.msg).toBe('Post not found');
  });

  test('should return 401 if the user is not authorized', async () => {
    // Create a second user
    const secondUser = await User.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password456'
    });

    auth.mockImplementationOnce((req, _, next) => {
      req.user = {
        id: secondUser._id,
      };
      next();
    });

    try {
      const response = await request(app)
        .delete(`/api/posts/${post._id}`);

      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe('User not authorized');
    } finally {
      // Clean up the second user
      await User.deleteOne({ email: 'janedoe@example.com' });
      await Post.deleteMany({});
    }
  });
});


//
// Test PUT /api/posts/like/:id
//
describe('PUT /api/posts/like/:id', () => {
  let user, post;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
    await Post.deleteMany({});

    post = await Post.create({
      text: 'Test post',
      user: user._id,
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should like post if user is authorized', async () => {
    try {
      const response = await request(app)
        .put(`/api/posts/like/${post._id}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body[0].user).toEqual(user._id.toString());
    } finally {
      await Post.deleteMany({});
    }
  });

  // test('should return 400 if post has already been liked', async () => {
  //   // Like the post first
  //   await request(app)
  //     .put(`/api/posts/like/${post._id}`)
  //     .send();

  //   // Attempt to like the post again
  //   const response = await request(app)
  //     .put(`/api/posts/like/${post._id}`)
  //     .send();

  //   console.log('Like Response: ', response.body); // Add this line

  //   expect(response.status).toBe(400);
  //   expect(response.body).toEqual({ msg: 'Post already liked' });
  //   await Post.deleteMany({});
  // });
});


//
// Test PUT /api/posts/unlike/:id
//
describe('PUT /api/posts/unlike/:id', () => {
  let user, post;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
    await Post.deleteMany({});

    post = await Post.create({
      text: 'Test post',
      user: user._id,
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  // test('should unlike post if user is authorized and post has been liked', async () => {
  //   // Like the post first
  //   await request(app)
  //     .put(`/api/posts/like/${post._id}`)
  //     .send();

  //   const response = await request(app)
  //     .put(`/api/posts/unlike/${post._id}`)
  //     .send();

  //   expect(response.status).toBe(200);
  //   expect(response.body.length).toBe(0);
  // });

  test('should return 400 if post has not been liked', async () => {
    try {
      const response = await request(app)
        .put(`/api/posts/unlike/${post._id}`)
        .send();

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ msg: 'Post has not yet been liked' });
    } finally {
      await Post.deleteMany({});
    }
  });
});


//
// Test POST /api/posts/comment/:id
//
describe('POST /api/posts/comment/:id', () => {
  let user, post;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      avatar: 'test_avatar',
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
    await Post.deleteMany({});

    post = await Post.create({
      text: 'Test post',
      user: user._id,
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should add comment to post if user is authorized and text is provided', async () => {
    const response = await request(app)
      .post(`/api/posts/comment/${post._id}`)
      .send({ text: 'Test comment' });

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      text: 'Test comment',
      name: 'test',
      avatar: 'test_avatar',
      user: user._id.toString(),
    });
  });

  test('should return 400 if text is not provided', async () => {
    try {
      const response = await request(app)
        .post(`/api/posts/comment/${post._id}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toEqual('Text is required');
    } finally {
      await Post.deleteMany({});
    }
  });
});

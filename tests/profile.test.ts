import request from 'supertest';
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db')
const auth = require('../middleware/auth')
const Profile = require('../models/Profile')

jest.mock('../middleware/auth')

//
// Test GET /api/profile/me
//
describe('GET /api/profile/me', () => {
  let user;
  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: 'password123'
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
    await Profile.deleteMany({});
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should return user profile if exists', async () => {
    const profile = new Profile({
      user: user._id,
      status: 'Developer',
      skills: ['JavaScript', 'Node.js'],
      experience: [],
      education: []
    });
    await profile.save();

    const res = await request(app).get('/api/profile/me').expect(200);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('name', 'test');
    expect(res.body).toHaveProperty('skills');
  });

  test('should return 400 error if no user profile exists', async () => {
    const res = await request(app).get('/api/profile/me').expect(400);
    expect(res.body).toHaveProperty('msg', 'There is no profile for this user');
  });

  test('should return 500 error if server error occurs', async () => {
    const errMsg = 'Server Error';

    auth.mockImplementationOnce(() => {
      throw new Error(errMsg);
    });

    const res = await request(app).get('/api/profile/me').expect(500);
    expect(res.text).toContain(errMsg);
  });
});


//
// Test POST /api/profile
//
describe('POST /api/profile', () => {
  let user;
  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: 'password123'
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
    await Profile.deleteMany({});
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should create a new user profile', async () => {
    const profileData = {
      status: 'Developer',
      skills: 'JavaScript, Node.js',
      company: 'Test Company',
      location: 'Test City'
    };

    const res = await request(app)
      .post('/api/profile')
      .send(profileData)
      .expect(200);

    expect(res.body).toHaveProperty('status', 'Developer');
    expect(res.body).toHaveProperty('skills');
    expect(res.body.skills.length).toBe(2);
  });

  test('should update an existing user profile', async () => {
    const initialProfileData = {
      user: user._id,
      status: 'Developer',
      skills: ['JavaScript', 'Node.js']
    };

    const initialProfile = new Profile(initialProfileData);
    await initialProfile.save();

    const updatedProfileData = {
      status: 'Senior Developer',
      skills: 'JavaScript, Node.js, Python'
    };

    const res = await request(app)
      .post('/api/profile')
      .send(updatedProfileData)
      .expect(200);

    expect(res.body).toHaveProperty('status', 'Senior Developer');
    expect(res.body).toHaveProperty('skills');
    expect(res.body.skills.length).toBe(3);
  });

  test('should return 400 error if required fields are missing', async () => {
    const profileData = {
      company: 'Test Company',
      location: 'Test City'
    };

    const res = await request(app)
      .post('/api/profile')
      .send(profileData)
      .expect(400);

    expect(res.body).toHaveProperty('errors');
  });

  test('should return 500 error if server error occurs', async () => {
    try {
      const errMsg = 'Server Error';
      const profileData = {
        status: 'Developer',
        skills: 'JavaScript, Node.js'
      };

      auth.mockImplementationOnce(() => {
        throw new Error(errMsg);
      });

      const res = await request(app)
        .post('/api/profile')
        .send(profileData)
        .expect(500);
      expect(res.text).toContain(errMsg);
    } finally {
      await User.deleteOne({ email: 'test@example.com' });
      await Profile.deleteMany({});
    }
  });
});


//
// Test POST api/profile/user/:user_id
//
const ObjectId = mongoose.Types.ObjectId;

describe('GET /api/profile/user/:user_id', () => {
  let user;
  let profile;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: 'password123'
    });

    profile = await Profile.create({
      user: user._id,
      status: 'Developer',
      skills: ['JavaScript', 'Node.js']
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await Profile.deleteOne({ user: user._id });
    await mongoose.disconnect();
  });

  test('should return user profile by user id', async () => {
    const res = await request(app).get(`/api/profile/user/${user._id}`).expect(200);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('_id', user._id.toString());
    expect(res.body).toHaveProperty('status', 'Developer');
  });

  test('should return 400 error if profile not found', async () => {
    const nonExistentUserId = new ObjectId();
    const res = await request(app).get(`/api/profile/user/${nonExistentUserId}`).expect(400);
    expect(res.body).toHaveProperty('msg', 'Profile not found');
  });

  // test('should return 400 error if invalid user id', async () => {
  //   const invalidUserId = 'invalidUserId';
  //   const res = await request(app).get(`/api/profile/user/${invalidUserId}`).expect(400);
  //   expect(res.body).toHaveProperty('msg', 'Porfile not found');
  // });

  test('should return 500 error if server error occurs', async () => {
    const errMsg = '{\"msg\":\"Server error\"}';
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const findOneMock = jest.spyOn(Profile, 'findOne');
    findOneMock.mockImplementationOnce(() => {
      throw new Error(errMsg);
    });

    const res = await request(app).get(`/api/profile/user/${user._id}`).expect(500);
    expect(res.text).toContain(errMsg);

    findOneMock.mockRestore();
    console.error = originalConsoleError;
  });
});


//
// Test DELETE api/profile
//
describe('DELETE /api/profile', () => {
  let user;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: 'password123'
    });

    await Profile.create({
      user: user._id,
      status: 'Developer',
      skills: ['JavaScript', 'Node.js']
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await mongoose.disconnect();
  });

  beforeEach(() => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should delete user profile and user', async () => {
    const res = await request(app)
      .delete('/api/profile')
      .expect(200);

    expect(res.body).toHaveProperty('msg', 'User deleted');

    const deletedProfile = await Profile.findOne({ user: user._id });
    expect(deletedProfile).toBeNull();

    const deletedUser = await User.findOne({ _id: user._id });
    expect(deletedUser).toBeNull();
  });

  test('should return 500 error if server error occurs', async () => {
    const errMsg = 'Server Error';
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const findOneAndRemoveMock = jest.spyOn(Profile, 'findOneAndRemove');
    findOneAndRemoveMock.mockImplementationOnce(() => {
      throw new Error(errMsg);
    });

    const res = await request(app).delete('/api/profile').expect(500);
    expect(res.text).toContain(errMsg);

    findOneAndRemoveMock.mockRestore();
    console.error = originalConsoleError;
  });
});


//
// Test PUT api/profile/experience
//
describe('PUT /api/profile/experience', () => {
  let user;
  let profile;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: 'password123'
    });

    profile = await Profile.create({
      user: user._id,
      status: 'Developer',
      skills: ['JavaScript', 'Node.js']
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await Profile.deleteOne({ user: user._id });
    await mongoose.disconnect();
  });

  beforeEach(() => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should add experience to profile', async () => {
    const experienceData = {
      title: 'Software Engineer',
      company: 'Awesome Company',
      location: 'San Francisco',
      from: '2021-06-01'
    };

    const res = await request(app)
      .put('/api/profile/experience')
      .send(experienceData)
      .expect(200);

    expect(res.body).toHaveProperty('experience');

    const receivedExperience = res.body.experience[0];
    const { from, ...rest } = receivedExperience;

    // Create a new object for comparison without the 'from' field
    const experienceDataWithoutFrom = { ...experienceData };
    delete experienceDataWithoutFrom.from;

    expect(rest).toMatchObject(experienceDataWithoutFrom);
    expect(new Date(from).toISOString().split('T')[0]).toBe(experienceData.from);
  });

  test('should return 400 error if required fields are missing', async () => {
    const experienceData = {
      location: 'San Francisco',
      from: '2021-06-01'
    };

    const res = await request(app)
      .put('/api/profile/experience')
      .send(experienceData)
      .expect(400);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(2);
  });

  test('should return 500 error if server error occurs', async () => {
    const errMsg = 'Server Error';
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const experienceData = {
      title: 'Software Engineer',
      company: 'Awesome Company',
      location: 'San Francisco',
      from: '2021-06-01'
    };

    const findOneMock = jest.spyOn(Profile, 'findOne');
    findOneMock.mockImplementationOnce(() => {
      throw new Error(errMsg);
    });

    const res = await request(app)
      .put('/api/profile/experience')
      .send(experienceData)
      .expect(500);

    expect(res.text).toContain(errMsg);

    findOneMock.mockRestore();
    console.error = originalConsoleError;
  });
});


//
// Test PUT api/profile/experience/:exp_id
//
describe('DELETE /api/profile/experience/:exp_id', () => {
  let user;
  let experienceId;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });

    const profile = new Profile({
      user: user._id,
      status: 'Developer',
      skills: ['HTML', 'CSS', 'JavaScript']
    });

    profile.experience.push({
      title: 'Software Engineer',
      company: 'Awesome Company',
      location: 'San Francisco',
      from: '2021-06-01'
    });

    await profile.save();

    experienceId = profile.experience[0]._id;
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await Profile.deleteOne({ user: user._id });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should delete the specified experience from the profile', async () => {
    const res = await request(app)
      .delete(`/api/profile/experience/${experienceId}`)
      .expect(200);

    expect(res.body).toHaveProperty('experience');
    expect(res.body.experience).toHaveLength(0);
  });

  // test('should return 500 error if server error occurs', async () => {
  //   const invalidExperienceId = 'invalidExperienceId';
  //   const res = await request(app)
  //     .delete(`/api/profile/experience/${invalidExperienceId}`)
  //     .expect(500);

  //   expect(res.text).toBe('Server Error');
  // });
});


//
// Test PUT api/profile/education
//
describe('PUT /api/profile/education', () => {
  let user;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });

    await Profile.create({
      user: user._id,
      status: 'Developer',
      skills: ['HTML', 'CSS', 'JavaScript']
    });
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await Profile.deleteOne({ user: user._id });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should add education to profile', async () => {
    const educationData = {
      school: 'Test University',
      degree: 'Bachelor of Science',
      fieldofstudy: 'Computer Science',
      from: '2018-08-01'
    };

    const res = await request(app)
      .put('/api/profile/education')
      .send(educationData)
      .expect(200);

    expect(res.body).toHaveProperty('education');
    const receivedEducation = res.body.education[0];
    const { from, ...rest } = receivedEducation;
    const { from: expectedFrom, ...expectedRest } = educationData;
    expect(rest).toMatchObject(expectedRest);
    expect(new Date(from).toISOString().split('T')[0]).toBe(expectedFrom);
  });

  test('should return 400 error if required fields are missing', async () => {
    const res = await request(app)
      .put('/api/profile/education')
      .send({})
      .expect(400);

    expect(res.body).toHaveProperty('errors');
  });

  // test('should return 500 error if server error occurs', async () => {
  //   const invalidData = {
  //     school: 123,
  //     degree: 'Bachelor of Science',
  //     fieldofstudy: 'Computer Science',
  //     from: '2018-08-01'
  //   };

  //   const res = await request(app)
  //     .put('/api/profile/education')
  //     .send(invalidData)
  //     .expect(500);

  //   expect(res.text).toBe('Server Error');
  // });
});


// Test
// DELETE api/profile/education/:edu_id
//
describe('DELETE /api/profile/education/:edu_id', () => {
  let user;
  let educationId;

  beforeAll(async () => {
    await connectDB();
    user = await User.create({
      name: 'test',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });

    const profile = await Profile.create({
      user: user._id,
      status: 'Developer',
      skills: ['HTML', 'CSS', 'JavaScript']
    });

    const newEdu = {
      school: 'Test University',
      degree: 'Bachelor of Science',
      fieldofstudy: 'Computer Science',
      from: '2018-08-01'
    };

    profile.education.unshift(newEdu);
    await profile.save();
    educationId = profile.education[0].id;
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'test@example.com' });
    await Profile.deleteOne({ user: user._id });
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    auth.mockImplementation((req, _, next) => {
      req.user = {
        id: user._id,
      };
      next();
    });
  });

  afterEach(() => {
    auth.mockReset();
  });

  test('should delete education from profile', async () => {
    const res = await request(app)
      .delete(`/api/profile/education/${educationId}`)
      .expect(200);

    const educationIds = res.body.education.map((edu) => edu.id);
    expect(educationIds).not.toContain(educationId);
  });

  // test('should return 500 error if education id is not valid', async () => {
  //   const invalidEduId = 'invalidEduId';

  //   await request(app)
  //     .delete(`/api/profile/education/${invalidEduId}`)
  //     .expect(500);
  // });
});
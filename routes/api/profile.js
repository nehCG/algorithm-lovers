/**
 * Profile API routes module.
 * @module routes/api/profile
 * @requires express
 * @requires middleware/auth
 * @requires express-validator
 * @requires models/Profile
 * @requires models/User
 * 
 * @example
 * // GET api/profile/me
 * // Usage:
 * // 1. Include auth middleware in your express app
 * const auth = require('../../middleware/auth');
 *
 * // 2. Add the following route in your express app
 * app.get('/api/profile/me', auth, async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a GET request with the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.get('http://localhost:5000/api/profile/me', {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // User's profile
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 * @example
 * // POST api/profile
 * // Usage:
 * // 1. Include auth middleware in your express app
 * const auth = require('../../middleware/auth');
 *
 * // 2. Add the following route in your express app
 * app.post('/api/profile', auth, async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a POST request with the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.post('http://localhost:5000/api/profile', {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   },
 *   data: {
 *     // Your profile data
 *   }
 * }).then(response => {
 *   console.log(response.data); // Created or updated profile
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 * @example
 * // GET api/profile/user/:user_id
 * // Usage:
 * // 1. Add the following route in your express app
 * app.get('/api/profile/user/:user_id', checkObjectId('user_id'), async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 2. Send a GET request
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.get('http://localhost:5000/api/profile/user/12345')
 *   .then(response => {
 *     console.log(response.data); // Profile object
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 * 
 * @example
 * // DELETE api/profile
 * // Usage:
 * // 1. Add the following route in your express app
 * app.delete('/api/profile', auth, async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 2. Send a DELETE request
 * // e.g., using axios:
 * const axios = require('axios');
 * const token = 'your_auth_token'; // Replace with the user's auth token
 *
 * axios.delete('http://localhost:5000/api/profile', {
 *   headers: { 'x-auth-token': token },
 * })
 *   .then(response => {
 *     console.log(response.data); // { msg: 'User deleted' }
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 * 
 * @example
 * // PUT api/profile/experience
 * // Usage:
 * // 1. Add the following route in your express app
 * app.put('/api/profile/experience', auth, check('title', 'Title is required').notEmpty(), ...);
 *
 * // 2. Send a PUT request with experience data
 * // e.g., using axios:
 * const axios = require('axios');
 * const token = 'your_auth_token'; // Replace with the user's auth token
 * const experienceData = {
 *   title: 'Software Engineer',
 *   company: 'Awesome Company',
 *   from: '2020-05-01'
 * };
 *
 * axios.put('http://localhost:5000/api/profile/experience', experienceData, {
 *   headers: { 'x-auth-token': token },
 * })
 *   .then(response => {
 *     console.log(response.data); // Updated profile
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 * 
 * @example
 * // DELETE api/profile/experience/:exp_id
 * // Usage:
 * // 1. Add the following route in your express app
 * app.delete('/api/profile/experience/:exp_id', auth, async (req, res) => { ... });
 *
 * // 2. Send a DELETE request with the experience ID to delete
 * // e.g., using axios:
 * const axios = require('axios');
 * const token = 'your_auth_token'; // Replace with the user's auth token
 * const experienceId = 'your_experience_id'; // Replace with the experience ID to delete
 *
 * axios.delete(`http://localhost:5000/api/profile/experience/${experienceId}`, {
 *   headers: { 'x-auth-token': token },
 * })
 *   .then(response => {
 *     console.log(response.data); // Updated profile
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 * 
 * @example
 * // PUT api/profile/education
 * // Usage:
 * // 1. Add the following route in your express app
 * app.put('/api/profile/education', auth, check(...), async (req, res) => { ... });
 *
 * // 2. Send a PUT request with the education data to add
 * // e.g., using axios:
 * const axios = require('axios');
 * const token = 'your_auth_token'; // Replace with the user's auth token
 * const educationData = {
 *   school: 'Example University',
 *   degree: 'Bachelor of Science',
 *   fieldofstudy: 'Computer Science',
 *   from: '2016-08-01',
 *   to: '2020-05-01',
 * };
 *
 * axios.put('http://localhost:5000/api/profile/education', educationData, {
 *   headers: { 'x-auth-token': token },
 * })
 *   .then(response => {
 *     console.log(response.data); // Updated profile
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 * 
 * @example
 * // DELETE api/profile/education/:edu_id
 * // Usage:
 * // 1. Add the following route in your express app
 * app.delete('/api/profile/education/:edu_id', auth, async (req, res) => { ... });
 *
 * // 2. Send a DELETE request with the education ID to delete
 * // e.g., using axios:
 * const axios = require('axios');
 * const token = 'your_auth_token'; // Replace with the user's auth token
 * const educationId = '5d713995b721c3bb38c1f5d0'; // Replace with the education ID to delete
 *
 * axios.delete(`http://localhost:5000/api/profile/education/${educationId}`, {
 *   headers: { 'x-auth-token': token },
 * })
 *   .then(response => {
 *     console.log(response.data); // Updated profile
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 */


const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
//const axios = require('axios');
//const config = require('config');

const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');


/**
 * @route   GET api/profile/me
 * @desc    Get current user's profile
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response containing the user's profile or an error message
 * @throws {Error} - If there's a server error
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route   POST api/profile
 * @desc    Create or update a user profile
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response containing the created or updated profile or an error message
 * @throws {Error} - If there's a server error
 */
router.post(
  '/',
  auth,
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      ...rest
    } = req.body;

    // Build profile object
    const profileFields = {
      user: req.user.id,
      website:
        website && website !== ''
          ? normalize(website, { forceHttps: true })
          : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()),
      ...rest
    };

    // Build social fields object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    // normalize social fields to ensure valid url
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true });
    }
    // add to profileFields
    profileFields.social = socialFields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);


/**
 * GET endpoint to fetch all profiles.
 *
 * @route GET /
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Array<Object>} Returns an array of profiles with the associated user's name and avatar, or an error message with the appropriate status code.
 * @throws {Error} Will return a 500 status if there is a server error.
 */
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route   GET api/profile/user/:user_id
 * @desc    Get profile by user ID
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response containing the user's profile or an error message
 * @throws {Error} - If there's a server error or invalid user ID
 */
router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  async ({ params: { user_id } }, res) => {
    try {
      const profile = await Profile.findOne({
        user: user_id
      }).populate('user', ['name', 'avatar']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);


/**
 * @route   DELETE api/profile
 * @desc    Delete profile, user & posts
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with a success message
 * @throws {Error} - If there's a server error
 */
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      Post.deleteMany({ user: req.user.id }),
      Profile.findOneAndRemove({ user: req.user.id }),
      User.findOneAndRemove({ _id: req.user.id })
    ]);

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route   PUT api/profile/experience
 * @desc    Add profile experience
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response containing the updated profile or an error message
 * @throws {Error} - If there's a server error
 */
router.put(
  '/experience',
  auth,
  check('title', 'Title is required').notEmpty(),
  check('company', 'Company is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


/**
 * @route   DELETE api/profile/experience/:exp_id
 * @desc    Delete experience from profile
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response containing the updated profile or an error message
 * @throws {Error} - If there's a server error
 */
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});


/**
 * @route   PUT api/profile/education
 * @desc    Add profile education
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response containing the updated profile or an error message
 * @throws {Error} - If there's a server error
 */
router.put('/education',
  auth,
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').notEmpty(),
  check('fieldofstudy', 'Field of study is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


/**
 * @route   DELETE api/profile/education/:edu_id
 * @desc    Delete education from profile
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response containing the updated profile or an error message
 * @throws {Error} - If there's a server error
 */
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );
    await foundProfile.save();

    return res.status(200).json(foundProfile);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});


/**
 * Profile API router.
 * @type {express.Router}
 */
module.exports = router;
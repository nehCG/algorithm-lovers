/**
 * Auth API routes module.
 * @module routes/api/auth
 * @requires express
 * @requires express.Router
 * @requires middleware/auth
 * @requires models/User
 * @requires jsonwebtoken
 * @requires express-validator
 * @requires bcryptjs
 * @requires config
 * 
 * @example
 * // GET api/auth
 * // Usage:
 * // 1. Include auth middleware in your express app
 * const auth = require('../../middleware/auth');
 *
 * // 2. Add the following route in your express app
 * app.get('/api/auth', auth, async (req, res) => {
 *   try {
 *     const user = await User.findById(req.user.id).select('-password');
 *     res.json(user);
 *   } catch (err) {
 *     console.error(err.message);
 *     res.status(500).send('Server Error');
 *   }
 * });
 *
 * // 3. Send a request with the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.get('http://localhost:5000/api/auth', {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data);
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 * @example
 * // POST api/auth
 * // Usage:
 * // 1. Include validation middleware in your express app
 * const { check, validationResult } = require('express-validator');
 *
 * // 2. Add the following route in your express app
 * app.post('/api/auth', [
 *   check('email', 'Please include a valid email').isEmail(),
 *   check('password', 'Password is required').exists(),
 * ], async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with email and password in the request body
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.post('http://localhost:5000/api/auth', {
 *   email: 'user@example.com',
 *   password: 'user_password',
 * }).then(response => {
 *   console.log(response.data); // JWT token
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 */


const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');


/**
 * @route   GET api/auth
 * @desc    Get authenticated user
 * @access  Protected
 * @param {function} auth - Authentication middleware function.
 * @param {function} asyncHandler - Express async handler function.
 * @returns {Object} User object without password.
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route   POST api/auth
 * @desc    Authenticate user & get token
 * @access  Public
 * @param {Array} validationRules - Array of Express Validator rules.
 * @param {function} asyncHandler - Express async handler function.
 * @returns {Object} JWT token.
 */
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      // See if user exists
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '6 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


/**
 * Auth API router.
 * @type {express.Router}
 */
module.exports = router;
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
 * @requires gravatar
 * @requires config
 */


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');


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
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
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
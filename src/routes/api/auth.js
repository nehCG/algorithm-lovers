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
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
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
    req.statusCode(500).send('Server Error');
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
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      // See if user exists
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
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

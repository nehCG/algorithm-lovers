/**
 * @module app
 * @requires express
 * @requires config/db
 */


const express = require('express');
const connectDB = require('../config/db');

const app = express();

// Coneect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));


/**
 * @route   GET /
 * @desc    Test API endpoint
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {string} - API status message
 */
app.get('/', (req, res) => res.send('API Running'));

// Define Routes

/**
 * @api {use} /api/users User routes
 * @apiGroup Routes
 * @apiName UserRoutes
 * @apiDescription Attaches user-related routes to the application
 */
app.use('/api/users', require('./routes/api/users'));


/**
 * @api {use} /api/auth Authentication routes
 * @apiGroup Routes
 * @apiName AuthRoutes
 * @apiDescription Attaches authentication-related routes to the application
 */
app.use('/api/auth', require('./routes/api/auth'));


/**
 * @api {use} /api/profile Profile routes
 * @apiGroup Routes
 * @apiName ProfileRoutes
 * @apiDescription Attaches profile-related routes to the application
 */
app.use('/api/profile', require('./routes/api/profile'));


/**
 * @api {use} /api/posts Post routes
 * @apiGroup Routes
 * @apiName PostRoutes
 * @apiDescription Attaches post-related routes to the application
 */
app.use('/api/posts', require('./routes/api/posts'));

module.exports = app;

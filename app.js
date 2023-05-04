/**
 * @module app
 * @requires express
 * @requires config/db
 */


const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

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

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
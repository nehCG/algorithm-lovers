/**
 * Middleware function to check if the given object ID in the request parameter is valid.
 *
 * @function
 * @param {string} idToCheck - The key of the object ID in the request parameters to check for validity.
 * @returns {Function} Express middleware function to validate the object ID and proceed to the next middleware or route handler.
 * @throws {Error} Will return a 400 status and JSON object with an error message if the object ID is not valid.
 *
 * @example
 * // Import the middleware
 * const checkObjectId = require('./checkObjectId');
 *
 * // Route that requires a valid object ID
 * app.get('/resource/:id', checkObjectId('id'), (req, res) => {
 *   res.send('Resource with valid ID');
 * });
 */
const mongoose = require('mongoose');
// middleware to check for a valid object id
const checkObjectId = (idToCheck) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
    return res.status(400).json({ msg: 'Invalid ID' });
  next();
};

module.exports = checkObjectId;
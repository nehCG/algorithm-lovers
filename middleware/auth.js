/**
 * Middleware to authenticate and verify JSON Web Token (JWT).
 * @module auth
 * @requires jsonwebtoken
 * @requires config
 */


const jwt = require('jsonwebtoken');
const config = require('config');


/**
 * Middleware function to authenticate and verify the JWT passed in the request header.
 *
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function to proceed to the next middleware or route handler.
 * @throws {Error} Will throw an error if the token is not valid.
 * @returns {Object|Function} If the token is not provided, returns a 401 status and JSON object with an error message. If the token is valid, calls the next middleware or route handler.
 *
 * @example
 * // Route that requires authentication
 * app.get('/protected', auth, (req, res) => {
 *   res.send('Protected content');
 * });
 */
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

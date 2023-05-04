/**
 * @module server
 * @requires app
 */


const app = require('./app');

const PORT = process.env.PORT || 6000;


/**
 * Starts the server and listens on the specified port
 * @listens {number} PORT - The port to start the server on (default: 6000)
 * @returns {Object} - The server instance
 * @throws {Error} - If there's a server error
 */
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;
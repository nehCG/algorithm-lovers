const app = require('./app');

const PORT = process.env.PORT || 6000;

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;

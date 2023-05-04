/**
 * User model module.
 * @module models/User
 * @requires mongoose
 */


const mongoose = require('mongoose');


/**
 * User Schema for MongoDB.
 * @typedef {Object} UserSchema
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user (unique).
 * @property {string} password - The hashed password of the user.
 * @property {string} avatar - The avatar URL of the user.
 * @property {Date} date - The date when the user was created (default: Date.now).
 */


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});


/**
 * User model based on UserSchema.
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('user', UserSchema);
/**
 * Post model module.
 * @module models/Post
 * @requires mongoose
 */


const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * @typedef {Object} Like
 * @property {Schema.Types.ObjectId} user - Reference to the user who liked the post.
 */

/**
 * @typedef {Object} Comment
 * @property {Schema.Types.ObjectId} user - Reference to the user who commented.
 * @property {string} text - The text content of the comment.
 * @property {string} name - The name of the user who commented.
 * @property {string} avatar - The avatar URL of the user who commented.
 * @property {Date} date - The date when the comment was posted (default: Date.now).
 */

/**
 * Post Schema for MongoDB.
 * @typedef {Object} PostSchema
 * @property {Schema.Types.ObjectId} user - Reference to the user who created the post.
 * @property {string} text - The text content of the post.
 * @property {string} name - The name of the user who created the post.
 * @property {string} avatar - The avatar URL of the user who created the post.
 * @property {Like[]} likes - An array of likes for the post.
 * @property {Comment[]} comments - An array of comments for the post.
 * @property {Date} date - The date when the post was created (default: Date.now).
 */


const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});


/**
 * Post model based on PostSchema.
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('post', PostSchema);
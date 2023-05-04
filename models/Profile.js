/**
 * Profile model module.
 * @module models/Profile
 * @requires mongoose
 */


const mongoose = require('mongoose');


/**
 * @typedef {Object} Experience
 * @property {string} title - Job title.
 * @property {string} company - Company name.
 * @property {string} location - Job location.
 * @property {Date} from - Job start date.
 * @property {Date} to - Job end date (optional if current is true).
 * @property {boolean} current - Indicates if the job is currently held (default: false).
 * @property {string} description - Job description.
 */


/**
 * @typedef {Object} Education
 * @property {string} school - School name.
 * @property {string} degree - Degree earned.
 * @property {string} fieldofstudy - Field of study.
 * @property {Date} from - Education start date.
 * @property {Date} to - Education end date (optional if current is true).
 * @property {boolean} current - Indicates if the education is ongoing (default: false).
 * @property {string} description - Description of the education experience.
 */

/**
 * @typedef {Object} Social
 * @property {string} youtube - YouTube profile URL.
 * @property {string} twitter - Twitter profile URL.
 * @property {string} facebook - Facebook profile URL.
 * @property {string} linkedin - LinkedIn profile URL.
 * @property {string} instagram - Instagram profile URL.
 */

/**
 * Profile Schema for MongoDB.
 * @typedef {Object} ProfileSchema
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the associated user.
 * @property {string} company - Company associated with the user.
 * @property {string} website - User's website URL.
 * @property {string} location - User's location.
 * @property {string} status - User's professional status.
 * @property {string[]} skills - Array of the user's skills.
 * @property {string} bio - User's biography.
 * @property {string} githubusername - User's GitHub username.
 * @property {Experience[]} experience - Array of user's work experiences.
 * @property {Education[]} education - Array of user's education experiences.
 * @property {Social} social - User's social media profile URLs.
 * @property {Date} date - Date when the profile was created (default: Date.now).
 */
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});


/**
 * Profile model based on ProfileSchema.
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('profile', ProfileSchema);
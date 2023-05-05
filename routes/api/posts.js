/**
 * Posts API routes module.
 * @module routes/api/posts
 * @requires express
 * @requires express.Router
 * @requires express-validator
 * @requires middleware/auth
 * @requires models/Post
 * @requires models/Profile
 * @requires models/User
 * 
 * @example
 * // POST api/posts
 * // Usage:
 * // 1. Include validation and auth middleware in your express app
 * const { check, validationResult } = require('express-validator');
 * const auth = require('../../middleware/auth');
 *
 * // 2. Add the following route in your express app
 * app.post('/api/posts', [
 *   auth,
 *   [check('text', 'Text is required').not().isEmpty()]
 * ], async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with text in the request body and the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.post('http://localhost:5000/api/posts', {
 *   text: 'This is a new post'
 * }, {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // Created post object
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 * @example
 * // GET api/posts
 * // Usage:
 * // 1. Include auth middleware in your express app
 * const auth = require('../../middleware/auth');
 *
 * // 2. Add the following route in your express app
 * app.get('/api/posts', auth, async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.get('http://localhost:5000/api/posts', {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // Array of post objects
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 * @example
 * // GET api/posts/:id
 * // Usage:
 * // 1. Include auth and checkObjectId middleware in your express app
 * const auth = require('../../middleware/auth');
 * const checkObjectId = require('../../middleware/checkObjectId');
 *
 * // 2. Add the following route in your express app
 * app.get('/api/posts/:id', auth, checkObjectId('id'), async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with the post ID in the URL and the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.get('http://localhost:5000/api/posts/your_post_id_here', {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // Post object
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 * @example
 * // DELETE api/posts/:id
 * // Usage:
 * // 1. Include auth and checkObjectId middleware in your express app
 * const auth = require('../../middleware/auth');
 * const checkObjectId = require('../../middleware/checkObjectId');
 *
 * // 2. Add the following route in your express app
 * app.delete('/api/posts/:id', [auth, checkObjectId('id')], async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with the post ID in the URL and the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.delete('http://localhost:5000/api/posts/your_post_id_here', {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // { msg: 'Post removed' }
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 *
 * @example
 * // PUT api/posts/like/:id
 * // Usage:
 * // 1. Include auth and checkObjectId middleware in your express app
 * const auth = require('../../middleware/auth');
 * const checkObjectId = require('../../middleware/checkObjectId');
 *
 * // 2. Add the following route in your express app
 * app.put('/api/posts/like/:id', auth, checkObjectId('id'), async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with the post ID in the URL and the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.put('http://localhost:5000/api/posts/like/your_post_id_here', {}, {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // Array of updated post likes
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 * @example
 * // PUT api/posts/unlike/:id
 * // Usage:
 * // 1. Include auth and checkObjectId middleware in your express app
 * const auth = require('../../middleware/auth');
 * const checkObjectId = require('../../middleware/checkObjectId');
 *
 * // 2. Add the following route in your express app
 * app.put('/api/posts/unlike/:id', auth, checkObjectId('id'), async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with the post ID in the URL and the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.put('http://localhost:5000/api/posts/unlike/your_post_id_here', {}, {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // Array of updated post likes
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 *
 * @example
 * // POST api/posts/comment/:id
 * // Usage:
 * // 1. Include auth and checkObjectId middleware in your express app
 * const auth = require('../../middleware/auth');
 * const checkObjectId = require('../../middleware/checkObjectId');
 *
 * // 2. Add the following route in your express app
 * app.post('/api/posts/comment/:id', [
 *   auth,
 *   checkObjectId('id'),
 *   [
 *     check('text', 'Text is required')
 *       .not()
 *       .isEmpty()
 *   ]
 * ], async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with the post ID in the URL, the token in the 'x-auth-token' header,
 * // and a JSON object containing the text field in the request body
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.post('http://localhost:5000/api/posts/comment/your_post_id_here', {
 *   text: 'Your comment here'
 * }, {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // Array of updated post comments
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 * 
 * @example
 * // DELETE /comment/:id/:comment_id
 * // Usage:
 * // 1. Include auth middleware in your express app
 * const auth = require('../../middleware/auth');
 *
 * // 2. Add the following route in your express app
 * app.delete('/api/posts/comment/:id/:comment_id', auth, async (req, res) => {
 *   // Your route handler logic
 * });
 *
 * // 3. Send a request with the post ID and comment ID in the URL, and the token in the 'x-auth-token' header
 * // e.g., using axios:
 * const axios = require('axios');
 *
 * axios.delete('http://localhost:5000/api/posts/comment/your_post_id_here/your_comment_id_here', {
 *   headers: {
 *     'x-auth-token': 'your_token_here'
 *   }
 * }).then(response => {
 *   console.log(response.data); // Array of updated post comments
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 */


const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');


/**
 * @typedef {Object} PostObject
 * @property {string} text - The content of the post.
 * @property {string} name - The name of the user who created the post.
 * @property {string} avatar - The avatar URL of the user who created the post.
 * @property {string} user - The user ID of the user who created the post.
 */


/**
 * @route   POST api/posts
 * @desc    Create a post
 * @access  Private
 * @param {Array} validationRules - Array of Express Validator rules.
 * @param {function} asyncHandler - Express async handler function.
 * @returns {Object} Created post object.
 */
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not().
        isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


/**
 * @route   GET api/posts
 * @desc    Get all posts
 * @access  Private
 * @param {function} auth - Authentication middleware function.
 * @param {function} asyncHandler - Express async handler function.
 * @returns {Array} Array of post objects.
 */
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route GET api/posts/:id
 * @desc Get post by ID
 * @access Private
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Returns the post as a JSON object if found, otherwise returns an error message.
 * @throws {Error} - If an error occurs during execution, an error message is sent as a response.
 */
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route DELETE api/posts/:id
 * @desc Delete a post
 * @access Private
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Returns a success message if the post is deleted, otherwise returns an error message.
 * @throws {Error} - If an error occurs during execution, an error message is sent as a response.
 */
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});


/**
 * @route PUT api/posts/like/:id
 * @description Like a post
 * @access Private
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Array} - Returns an array of updated post likes.
 * @throws {Error} - If an error occurs during execution, an error message is sent as a response.
 */
router.put('/like/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route PUT api/posts/unlike/:id
 * @description Unlike a post
 * @access Private
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Array} - Returns an array of updated post likes.
 * @throws {Error} - If an error occurs during execution, an error message is sent as a response.
 */
router.put('/unlike/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has not yet been liked
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // remove the like
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


/**
 * @route POST api/posts/comment/:id
 * @description Comment on a post
 * @access Private
 * @param {object} req - The request object.
 * @param {Array} req.body - An array of validation middleware.
 * @param {Function} req.body.check - Middleware to check if the text field is not empty.
 * @param {object} res - The response object.
 * @returns {Array} - Returns an array of updated post comments.
 * @throws {Error} - If an error occurs during execution, an error message is sent as a response.
 */
router.post(
  '/comment/:id',
  [
    auth,
    checkObjectId('id'),
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


/**
 * DELETE endpoint to delete a comment from a post.
 *
 * @route DELETE /comment/:id/:comment_id
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} auth - Authentication middleware function.
 * @returns {Object} Returns the updated comments array after deleting the specified comment, or an error message with the appropriate status code.
 * @throws {Error} Will return a 404 status if the comment does not exist, a 401 status if the user is not authorized, or a 500 status if there is a server error.
 */
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});


/**
 * Posts API router.
 * @type {express.Router}
 */
module.exports = router;
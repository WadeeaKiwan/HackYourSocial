const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { checkText } = require('../../middleware/validation');

const createPost = require('../actions/posts/createPost');
const getAllPosts = require('../actions/posts/getAllPosts');
const getPostById = require('../actions/posts/getPostById');
const deletePost = require('../actions/posts/deletePost');
const likePost = require('../actions/posts/likePost');
const unlikePost = require('../actions/posts/unlikePost');
const commentOnPost = require('../actions/posts/commentOnPost');
const deleteCommentOnPost = require('../actions/posts/deleteCommentOnPost');

// @route     POST api/posts
// @desc      Create a post
// @access    Private
router.post('/', [auth, checkText], createPost);

// @route     GET api/posts
// @desc      Get all posts
// @access    Private
router.get('/', auth, getAllPosts);

// @route     GET api/posts/:id
// @desc      Get post by ID
// @access    Private
router.get('/:id', auth, getPostById);

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', auth, deletePost);

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, likePost);

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', auth, unlikePost);

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post('/comment/:id', [auth, checkText], commentOnPost);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, deleteCommentOnPost);

module.exports = router;

const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { checkLogin } = require('../../middleware/validation');

const getAuthUser = require('../actions/auth&users/getAuthUser');
const loginUser = require('../actions/auth&users/loginUser');

// @route     GET api/auth
// @desc      Get Authenticated User
// @access    Public
router.get('/', auth, getAuthUser);

// @route     POST api/auth
// @desc      Authenticate user & get token
// @access    Public
router.post('/', checkLogin, loginUser);

module.exports = router;

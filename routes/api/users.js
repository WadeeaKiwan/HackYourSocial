const express = require('express');
const router = express.Router();

const { checkRegister } = require('../../middleware/validation');

const registerUser = require('../actions/auth&users/registerUser');

// @route     POST api/users
// @desc      Register user
// @access    Public
router.post('/', checkRegister, registerUser);

module.exports = router;

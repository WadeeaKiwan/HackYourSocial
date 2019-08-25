const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { checkRegister, checkEmail } = require('../../middleware/validation');

const registerUser = require('../actions/auth&users/registerUser');
const emailConfirmation = require('../actions/auth&users/emailConfirmation');
const resendConfirmation = require('../actions/auth&users/emailConfirmation');

// @route     POST api/users
// @desc      Register user
// @access    Public
router.post('/', checkRegister, registerUser);

// @route     POST api/users/verify/:token
// @desc      Email Confirmation
// @access    Public
router.post('/verify/:token', emailConfirmation);

// @route     POST api/users/verify/resend
// @desc      Resend Email Confirmation
// @access    Public
router.post('/verify/resend', [auth, checkEmail], resendConfirmation);

module.exports = router;

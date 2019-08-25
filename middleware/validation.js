const { check } = require('express-validator');

const checkLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

const checkRegister = [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

const checkProfile = [
  check('status', 'Status is required')
    .not()
    .isEmpty(),
  check('skills', 'Skills is required')
    .not()
    .isEmpty(),
];

const checkExperience = [
  check('title', 'Title is required')
    .not()
    .isEmpty(),
  check('company', 'Company is required')
    .not()
    .isEmpty(),
  check('from', 'From date is required')
    .not()
    .isEmpty(),
];

const checkEducation = [
  check('school', 'School is required')
    .not()
    .isEmpty(),
  check('degree', 'Degree is required')
    .not()
    .isEmpty(),
  check('fieldofstudy', 'Field of study is required')
    .not()
    .isEmpty(),
  check('from', 'From date is required')
    .not()
    .isEmpty(),
];

const checkText = [
  check('text', 'Text is required')
    .not()
    .isEmpty(),
];

const checkEmail = [check('email', 'Please include a valid email').isEmail()];

module.exports = {
  checkLogin,
  checkRegister,
  checkProfile,
  checkExperience,
  checkEducation,
  checkText,
  checkEmail,
};

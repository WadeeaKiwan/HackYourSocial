const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { checkProfile, checkExperience, checkEducation } = require('../../middleware/validation');

const getCurrentUserProfile = require('../actions/profile/getCurrentUserProfile');
const createOrUpdateCurrentUserProfile = require('../actions/profile/createOrUpdateCurrentUserProfile');
const getAllProfiles = require('../actions/profile/getAllProfiles');
const getProfileByUserId = require('../actions/profile/getProfileByUserId');
const deleteProfileUserPosts = require('../actions/profile/deleteProfileUserPosts');
const addExperience = require('../actions/profile/addExperience');
const deleteExperience = require('../actions/profile/deleteExperience');
const addEducation = require('../actions/profile/addEducation');
const deleteEducation = require('../actions/profile/deleteEducation');
const getUserRepos = require('../actions/profile/getUserRepos');

// @route     GET api/profile/me
// @desc      Get current users profile
// @access    Private
router.get('/me', auth, getCurrentUserProfile);

// @route     POST api/profile
// @desc      Create or update users profile
// @access    Private
router.post('/', [auth, checkProfile], createOrUpdateCurrentUserProfile);

// @route     GET api/profile
// @desc      Get all profiles
// @access    Public
router.get('/', getAllProfiles);

// @route     GET api/profile/user/:user_id
// @desc      Get profile by user ID
// @access    Public
router.get('/user/:user_id', getProfileByUserId);

// @route     DELETE api/profile
// @desc      Delete profile, user & posts
// @access    Private
router.delete('/', auth, deleteProfileUserPosts);

// @route     PUT api/profile/experience
// @desc      Add profile experience
// @access    Private
router.put('/experience', [auth, checkExperience], addExperience);

// @route     DELETE api/profile/experience/:exp_id
// @desc      Delete experience from profile
// @access    Private
router.delete('/experience/:exp_id', auth, deleteExperience);

// @route     PUT api/profile/education
// @desc      Add profile education
// @access    Private
router.put('/education', [auth, checkEducation], addEducation);

// @route     DELETE api/profile/education/:edu_id
// @desc      Delete education from profile
// @access    Private
router.delete('/education/:edu_id', auth, deleteEducation);

// @route     GET api/profile/github/:username
// @desc      Get user repos from Github
// @access    Public
router.get('/github/:username', getUserRepos);

module.exports = router;

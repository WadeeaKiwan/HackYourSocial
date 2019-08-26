const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../../../middleware/mailer');

const User = require('../../../models/User');

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    user = new User({
      name,
      email,
      password,
      avatar,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };
    console.log('payload', payload);
    const token = await jwt.sign(payload, config.get('jwtSecret'));
    console.log('token', token);
    console.log('type of token', typeof token);
    // Check if not token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Email body
    const html = `
          Hi ${name},
          <br/><br/>
          Thanks for your registration!
          <br/><br/>
          Please verify your account by clicking the following link:
          <a href="http://localhost:3000/verify/${token}">Here</a>
          <br/><br/>
          Thanks, Hack Your Social Team
    `;

    // Send the email
    await sendEmail(
      '"HackYourSocial Activation 👻" <activate@hackyoursocial.com>',
      email,
      'Please verify your account',
      html,
    );

    res.json({ msg: 'You are registered! Please, visit your email to confirm your account' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = registerUser;

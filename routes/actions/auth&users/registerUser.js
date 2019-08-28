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

    const token = await jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '15m' });

    // Check if not token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Email body
    const html = `
          <style>
            .container {
              margin: auto;
              overflow: hidden;
              padding: 0 2rem;
              font-family: 'Comic Sans MS', sans-serif;
              font-size: 1rem;
              line-height: 1.6;
            }
            .large {
              font-size: 2rem;
              line-height: 1.2;
              margin-bottom: 1rem;
              color: blue;
            }
            .p {
              padding: 0.5rem;
            }
            .my-1 {
              margin: 1rem 0;
            }
            .lead {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
          </style>
          <body class="container">
            <h1>
              Hi ${name},
            </h1>
            <p class="p large">
              Thanks for your registration!
            </p>
            <p class="p lead">Please verify your account by clicking: 
              <a href="https://confirm-email.herokuapp.com/verify/${token}">
                Here
              </a>
            </p>
            <p class="p lead">
              Thanks, Hack Your Social Team
            </p>
          </body>
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

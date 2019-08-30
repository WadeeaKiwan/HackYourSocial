const jwt = require('jsonwebtoken');
const config = require('config');

const { validationResult } = require('express-validator');

const { sendEmail } = require('../../../middleware/mailer');

const User = require('../../../models/User');

const resendConfirmation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] });
    }

    if (user.active) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Your account has been already confirmed!' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1h' });

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
              font-family: 'Georgia', sans-serif;
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
              Hi ${user.name},
            </h1>
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

    res
      .status(200)
      .json({ msg: 'A new confirmation link has been sent. Please, check your email' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports = resendConfirmation;

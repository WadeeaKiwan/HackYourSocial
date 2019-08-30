const jwt = require('jsonwebtoken');
const config = require('config');

const { sendEmail } = require('../../../middleware/mailer');

const User = require('../../../models/User');

const emailConfirmation = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = await jwt.verify(token, config.get('jwtSecret'));

    let user = await User.findById({ _id: decoded.user.id }).select('-password');

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Activation link has expired!' }] });
    }

    user.active = true;
    await user.save();

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
          <p class="p large">
            Your account has been confirmed!
          </p>
          <p class="p lead">
            Thanks, Hack Your Social Team
          </p>
        </body>
    `;

    // Send the email
    await sendEmail(
      '"HackYourSocial Activation 👻" <activate@hackyoursocial.com>',
      user.email,
      'Account confirmed!',
      html,
    );

    res.status(200).json({ msg: 'Your account has been confirmed!' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(404).json({ msg: 'Activation link has expired!' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports = emailConfirmation;

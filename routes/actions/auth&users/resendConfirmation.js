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
          Hi ${user.name},
          <br/><br/>
          Please verify your account by clicking: 
          <a href="https://confirm-email.herokuapp.com/verify/${token}">Here</a>
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

    res.json({ msg: 'A new confirmation link has been sent. Please, check your email' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).json({ msg: err.message });
  }
};

module.exports = resendConfirmation;

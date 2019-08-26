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
            Hi ${user.name},
            <br/><br/>
            Your account has been confirmed!
            <br/><br/>
            Thanks, Hack Your Social Team
            `;

    // Send the email
    await sendEmail(
      '"HackYourSocial Activation 👻" <activate@hackyoursocial.com>',
      user.email,
      'Account confirmed!',
      html,
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    // if (err.name == 'jwt expired') {
    //   return res.status(404).json({ msg: 'Activation link has expired!' });
    // }
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = emailConfirmation;

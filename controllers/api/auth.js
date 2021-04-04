const router = require('express').Router();
const { compare } = require('bcryptjs');
require('dotenv').config();

const { User } = require('../../models');
const { createRefreshToken, sendRefreshToken, revokeRefreshTokensForUser } = require('../../utils/auth');
const { requireCookie } = require('../../middlewares/auth');

// "/" endpoint

router.post('/register', async (req, res) => {
  try {
    const user = await User.create({
      'name': req.body.name,
      'email': req.body.email,
      'password': req.body.password,
    });

    if (!user) {
      throw Error('no user');
    }

    res.status(200).json({ success: true });
  } catch (err) {
    let message = 'Unknown server error.';

    if (Array.isArray(err.errors)) {
      const error = err.errors[0];
      if (error.type.includes('unique')) {
        let columnWithDuplicate = error.path.split('.')[error.path.length - 1];
        message = `That ${columnWithDuplicate} is already used.`;
      }
    }

    res.status(500).json({ success: false, message });
  }
});

router.post('/login', async (req, res) => {
  try {
    // check email
    const user = await User.findOne({ where: { email: req.body.email }});

    if (!user) {
      throw Error('no user');
    }

    // check password
    const valid = await compare(req.body.password, user.password);

    if (!valid) {
      throw Error('bad password');
    }

    // login success

    // set refresh token
    sendRefreshToken(res, await createRefreshToken(user));

    // send response
    res.status(200).json({ success: true });
  } catch (err) {
    let message = 'Username or password is incorrect.';
    res.status(403).json({ success: false, message });
  }
});

router.post('/logout', requireCookie, async (req, res) => {
  try {
    res.clearCookie('jid');
    revokeRefreshTokensForUser(req.userData);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(403);
  }
});

module.exports = router;

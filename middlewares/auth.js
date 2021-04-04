const { verify } = require('jsonwebtoken');
const { User } = require('../models');

const isCookie = async (req, res, next) => {
  // get token
  const token = req.cookies.jid;

  if (!token) {
    return next();
  }

  try {
    // get payload
    const payload = verify(token, process.env.REFRESH_TOKEN_SECRET);

    // get user
    const userData = await User.findByPk(payload.userId);
    if (!userData) {
      throw Error('no user');
    }

    // attach to req
    req.userData = userData;

    // pass user to handlebars
    res.locals.userSignIn = userData.get({ plain: true });
    return next();
  } catch (err) {
    return next();
  }
};

const requireCookie = (req, res, next) => {
  if (req.userData) {
    return next();
  } else {
    res.redirect('/login');
  }
};

module.exports = { requireCookie, isCookie };

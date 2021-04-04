const router = require('express').Router();

const { revokeRefreshTokensForUser } = require('../utils/auth');
const { requireCookie } = require('../middlewares/auth');

// "/" endpoint

router.get('/login', (req, res) => {
  res.render('login', { success: true, layout: 'auth.handlebars'});
});

router.get('/register', (req, res) => {
  res.render('register', {layout: 'auth.handlebars'});
});

router.get('/logout', requireCookie, async (req, res) => {
  // remove token from cookie
  res.clearCookie('jid');

  // invalidate all previous cookie tokens
  revokeRefreshTokensForUser(req.userData);

  // dont pass cookie user to handlebars
  delete res.locals.userSignIn;

  // render
  res.render('logout');
});

module.exports = router;

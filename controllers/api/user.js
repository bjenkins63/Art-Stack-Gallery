const router = require('express').Router();
const { User } = require('../../models');
const { requireCookie } = require('../../middlewares/auth');

// "/user" endpoint

router.get('/', requireCookie, async (req, res) => {
  try {
    const user = req.userData.get({ plain: true });
    delete user.password;
    res.status(200).json({ ...user });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put('/:id', requireCookie, async (req, res) => {
  try {
    await User.update({
      'name': req.body.name,
      'email': req.body.email,
      'bio': req.body.bio,
      'website': req.body.website,
      'image_url': req.body.imageUrl
    }, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({success: true});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
});

module.exports = router;

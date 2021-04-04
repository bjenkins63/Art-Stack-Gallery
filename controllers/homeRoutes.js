const router = require('express').Router();
const sequelize = require('sequelize');

const { User, Exhibit } = require('../models');
const { requireCookie } = require('../middlewares/auth');

// Landing Page (Where users choose to login/signup as artist or go to the homepage as a visitor)
router.get('/', (req, res) => {
  res.render('home');
});

// Home Page (Where all of the users and their newest shortstack is displayed)
router.get('/gallery', async (req, res) => {
  try {
    // Get all exhibits with their artist's name.
    const exhibitData = await Exhibit.findAll({
      // Randomly sort the artwork
      order: sequelize.fn('RAND'),
      include: [
        // Get the exhibit's artist.
        { model: User, attributes: ['id', 'name'] },
      ],
    });
    // Convert exhibitData into a more readable format
    const exhibits = exhibitData.map((exhibit) => exhibit.get({ plain: true }));
    // Render the page via Handlebars
    res.render('gallery', { exhibits });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', requireCookie, (req, res) => {
  res.redirect(`/user/${req.userData.id}`);
});

router.get('/user/:id', async (req, res) => {
  try {
    let privatePage = false;

    if (req.userData) {
      if (req.userData.id === parseInt(req.params.id)) {
        // true if signed in as user being viewed
        privatePage = true;
      }
    }

    const userData = await User.findByPk(req.params.id, { include: Exhibit });
    if (!userData) {
      throw Error('no user');
    }
    const user = userData.get({ plain: true });

    res.render('artist', { user, privatePage });
  } catch {
    res.send('user does not exist');
  }
});

router.get('/editUser/:id', async (req, res) => {
  try {
    if (req.userData) {
      if (req.userData.id === parseInt(req.params.id)) {
        const userData = await User.findByPk(req.params.id);
        if (!userData) {
          throw Error('no user');
        }
        const user = userData.get({ plain: true });
        res.render('userInfo', { user, layout: 'fileUpload.handlebars' });
      }
    } else {
      res.render('error');
    }
  } catch {
    res.send('user does not exist');
  }
});

// Upload Page (Where users submit their short stack) Requires user to be logged in
router.get('/submit', requireCookie, (req, res) => {
  res.render('Submit', {layout: 'fileUpload.handlebars'});
});

router.get('/editExhibit/:id', async (req, res) => {
  try {
    if (req.userData) {
      // Get the selected exhibit.
      const exhibitData = await Exhibit.findByPk(req.params.id, {
        include: [
          // Get the exhibit's artist.
          { model: User, attributes: ['id', 'name'] },
        ],
      });
      // Check if exhibit belongs to user
      if (req.userData.id === exhibitData.user.id) {
        const exhibit = exhibitData.get({ plain: true });
        res.render('exhibitInfo', { exhibit, layout: 'fileUpload.handlebars' });
      }
    } else {
      res.render('error');
    }
  } catch (err) {
    res.send('user does not exist');
  }
});

module.exports = router;

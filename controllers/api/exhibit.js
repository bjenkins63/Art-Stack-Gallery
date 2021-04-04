const router = require('express').Router();

const { Exhibit } = require('../../models');
const { requireCookie } = require('../../middlewares/auth');

router.get('/:id', async (req, res) => {
  try {
    // Get the specific exhibit's data
    const exhibitData = await Exhibit.findByPk(req.params.id);
    // Convert exhibitData into a more readable format
    const exhibits = exhibitData.get({ plain: true });
    res.status(200).json(exhibits);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', requireCookie, async (req, res) => {
  try {
    // Create a new exhibit
    await Exhibit.create({
      'title': req.body.title,
      'medium': req.body.medium,
      'size': req.body.size,
      'price': req.body.price,
      'image_url': req.body.imageUrl,
      'user_id': req.userData.id
    });
    res.status(200).json({success: true});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
});

router.put('/:id', requireCookie, async (req, res) => {
  try {
    await Exhibit.update({
      'title': req.body.title,
      'medium': req.body.medium,
      'size': req.body.size,
      'price': req.body.price,
      'image_url': req.body.imageUrl,
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

router.delete('/:id', requireCookie, async (req, res) => {
  try {
    const exhibitData = await Exhibit.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!exhibitData) {
      res.status(404).json({ message: 'Exhibit not found!' });
      return;
    }
    res.status(200).json(exhibitData ? 'Exhibit deleted!' : 'Failed to delete exhibit');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

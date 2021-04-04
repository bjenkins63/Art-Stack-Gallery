const router = require('express').Router();

const homeRoutes = require('./homeRoutes');
const authRoutes = require('./auth');
const apiRoutes = require('./api');

const { isCookie } = require('../middlewares/auth');
router.use(isCookie);

router.use('/', homeRoutes);
router.use('/', authRoutes);
router.use('/api', apiRoutes);

module.exports = router;

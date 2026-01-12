const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { listDbArticles, getDbArticle } = require('../controllers/dbArticlesController');

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', listDbArticles);
router.get('/:articleId', getDbArticle);

module.exports = router;

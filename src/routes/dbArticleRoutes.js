const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { listDbArticles, getDbArticle } = require('../controllers/articlesController');

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', listDbArticles);
router.get('/:articleId', getDbArticle);

module.exports = router;

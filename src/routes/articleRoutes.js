const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { listArticles, getArticle } = require('../controllers/articlesController');

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', listArticles);
router.get('/:articleId', getArticle);

module.exports = router;

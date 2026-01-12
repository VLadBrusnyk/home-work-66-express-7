const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { listArticles, getArticle, createArticle } = require('../controllers/articlesController');

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', listArticles);
router.get('/:articleId', getArticle);
router.post('/', createArticle);

module.exports = router;

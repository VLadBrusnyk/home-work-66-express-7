const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const {
    apiFindArticles,
    apiInsertOne,
    apiInsertMany,
    apiUpdateOne,
    apiReplaceOne,
    apiUpdateMany,
    apiDeleteOne,
    apiDeleteMany,
} = require('../controllers/apiDbArticlesController');

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', apiFindArticles);
router.post('/', apiInsertOne);
router.post('/bulk', apiInsertMany);
router.post('/update-many', apiUpdateMany);
router.post('/delete-many', apiDeleteMany);
router.patch('/:articleId', apiUpdateOne);
router.put('/:articleId', apiReplaceOne);
router.delete('/:articleId', apiDeleteOne);

module.exports = router;

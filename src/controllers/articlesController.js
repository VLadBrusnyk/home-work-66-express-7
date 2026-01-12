const { listArticles: listArticlesFromStore, getArticleById } = require('../data/articlesStore');

function listArticles(req, res) {
    return res.render('articles/list.ejs', { articles: listArticlesFromStore(), basePath: '/articles' });
}

function getArticle(req, res) {
    const { articleId } = req.params;
    const article = getArticleById(articleId);
    if (!article) {
        return res.status(404).send(`Article not found: ${articleId}`);
    }
    return res.render('articles/detail.ejs', { article, basePath: '/articles' });
}

function createArticle(req, res) {
    const { title } = req.body;
    return res.status(201).send(`Article created: ${title || 'Untitled'}`);
}

module.exports = { listArticles, getArticle, createArticle };

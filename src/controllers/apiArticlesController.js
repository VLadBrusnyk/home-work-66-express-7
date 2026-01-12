const {
    listArticles,
    getArticleById,
    createArticle,
    replaceArticle,
    patchArticle,
    deleteArticle,
} = require('../data/articlesStore');

function apiListArticles(req, res) {
    return res.json(listArticles());
}

function apiGetArticle(req, res) {
    const { articleId } = req.params;
    const article = getArticleById(articleId);
    if (!article) {
        return res.status(404).json({ error: `Article not found: ${articleId}` });
    }
    return res.json(article);
}

function apiCreateArticle(req, res) {
    const { title, author, body } = req.body || {};
    const article = createArticle({ title, author, body });
    return res.status(201).json(article);
}

function apiReplaceArticle(req, res) {
    const { articleId } = req.params;
    const { title, author, body } = req.body || {};
    const updated = replaceArticle(articleId, { title, author, body });
    if (!updated) {
        return res.status(404).json({ error: `Article not found: ${articleId}` });
    }
    return res.json(updated);
}

function apiPatchArticle(req, res) {
    const { articleId } = req.params;
    const updated = patchArticle(articleId, req.body || {});
    if (!updated) {
        return res.status(404).json({ error: `Article not found: ${articleId}` });
    }
    return res.json(updated);
}

function apiDeleteArticle(req, res) {
    const { articleId } = req.params;
    const ok = deleteArticle(articleId);
    if (!ok) {
        return res.status(404).json({ error: `Article not found: ${articleId}` });
    }
    return res.status(204).send();
}

module.exports = {
    apiListArticles,
    apiGetArticle,
    apiCreateArticle,
    apiReplaceArticle,
    apiPatchArticle,
    apiDeleteArticle,
};

const ARTICLES = [
    {
        id: '1',
        title: 'Express templating basics',
        author: 'editor',
        body: 'PUG and EJS can render server-side HTML pages in Express.',
    },
    {
        id: '2',
        title: 'Routing and controllers',
        author: 'editor',
        body: 'Keep routes thin and move logic into controllers.',
    },
    {
        id: '3',
        title: 'Middleware patterns',
        author: 'editor',
        body: 'Middleware can validate input, authorize access, and handle errors.',
    },
];

function listArticles() {
    return ARTICLES;
}

function getArticleById(id) {
    return ARTICLES.find((a) => a.id === String(id));
}

function createArticle({ title, author, body }) {
    const nextId = String(Math.max(0, ...ARTICLES.map((a) => Number(a.id) || 0)) + 1);
    const article = {
        id: nextId,
        title: title || 'Untitled',
        author: author || 'editor',
        body: body || '',
    };
    ARTICLES.push(article);
    return article;
}

function replaceArticle(id, { title, author, body }) {
    const index = ARTICLES.findIndex((a) => a.id === String(id));
    if (index === -1) return null;
    const updated = {
        id: String(id),
        title: title || 'Untitled',
        author: author || 'editor',
        body: body || '',
    };
    ARTICLES[index] = updated;
    return updated;
}

function patchArticle(id, patch) {
    const article = getArticleById(id);
    if (!article) return null;
    const applyField = (value, fallback, current) => (value === undefined ? current : value || fallback);
    article.title = applyField(patch.title, 'Untitled', article.title);
    article.author = applyField(patch.author, 'editor', article.author);
    article.body = applyField(patch.body, '', article.body);
    return article;
}

function deleteArticle(id) {
    const index = ARTICLES.findIndex((a) => a.id === String(id));
    if (index === -1) return false;
    ARTICLES.splice(index, 1);
    return true;
}

module.exports = {
    listArticles,
    getArticleById,
    createArticle,
    replaceArticle,
    patchArticle,
    deleteArticle,
};

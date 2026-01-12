const Article = require('../models/Article');
const { isMongoConnected, mongoose } = require('../db/mongoose');

function mapArticleForView(doc) {
    return {
        id: String(doc._id),
        title: doc.title,
        author: doc.author,
        body: doc.body,
    };
}

async function listDbArticles(req, res, next) {
    try {
        if (!isMongoConnected()) {
            return res
                .status(500)
                .send('MongoDB is not connected. Set MONGODB_URI and restart the server.');
        }

        const docs = await Article.find({}).sort({ createdAt: -1 }).lean();
        const articles = docs.map(mapArticleForView);

        return res.render('articles/list.ejs', { articles, basePath: '/db/articles' });
    } catch (err) {
        return next(err);
    }
}

async function getDbArticle(req, res, next) {
    try {
        if (!isMongoConnected()) {
            return res
                .status(500)
                .send('MongoDB is not connected. Set MONGODB_URI and restart the server.');
        }

        const { articleId } = req.params;

        if (!mongoose.isValidObjectId(articleId)) {
            return res
                .status(400)
                .send(`Invalid articleId (MongoDB _id expected): ${articleId}`);
        }

        const doc = await Article.findById(articleId).lean();
        if (!doc) {
            return res.status(404).send(`Article not found: ${articleId}`);
        }

        const article = mapArticleForView(doc);
        return res.render('articles/detail.ejs', { article, basePath: '/db/articles' });
    } catch (err) {
        return next(err);
    }
}

module.exports = { listDbArticles, getDbArticle };

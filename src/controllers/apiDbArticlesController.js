const Article = require('../models/Article');
const { isMongoConnected, mongoose } = require('../db/mongoose');

function mapArticleDoc(doc) {
    const plain = doc && doc.toObject ? doc.toObject() : doc;
    const { _id, ...rest } = plain || {};
    return { id: _id ? String(_id) : undefined, ...rest };
}

function buildProjection(fieldsParam) {
    if (!fieldsParam || typeof fieldsParam !== 'string') return undefined;
    const projection = {};
    fieldsParam
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean)
        .forEach((field) => {
            projection[field] = 1;
        });
    projection._id = 1;
    return Object.keys(projection).length ? projection : undefined;
}

function ensureMongo(res) {
    if (isMongoConnected()) return true;
    res.status(500).json({ error: 'MongoDB is not connected. Set MONGODB_URI and restart the server.' });
    return false;
}

async function apiFindArticles(req, res, next) {
    try {
        if (!ensureMongo(res)) return;

        const { author, title, q, fields } = req.query;
        const filter = {};
        if (author) filter.author = author;
        if (title) filter.title = title;
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { body: { $regex: q, $options: 'i' } },
            ];
        }

        const projection = buildProjection(fields);
        const docs = await Article.find(filter, projection).sort({ createdAt: -1 }).lean();
        const items = docs.map(mapArticleDoc);

        return res.json({ count: items.length, items });
    } catch (err) {
        return next(err);
    }
}

async function apiInsertOne(req, res, next) {
    try {
        if (!ensureMongo(res)) return;

        const payload = req.body;
        if (!payload || typeof payload !== 'object' || Array.isArray(payload) || Object.keys(payload).length === 0) {
            return res.status(400).json({
                error: 'Request body is empty or invalid. Send JSON with Content-Type: application/json',
                example: { title: 'New from Atlas', author: 'editor', body: 'Hello' },
            });
        }

        const { title, author, body } = payload;
        if (!title) {
            return res.status(400).json({
                error: 'title is required',
                requiredFields: ['title'],
                receivedFields: Object.keys(payload),
            });
        }

        const doc = await Article.create({ title, author, body });
        return res.status(201).json(mapArticleDoc(doc));
    } catch (err) {
        return next(err);
    }
}

async function apiInsertMany(req, res, next) {
    try {
        if (!ensureMongo(res)) return;

        const { items } = req.body || {};
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'items array is required for insertMany' });
        }

        const docs = await Article.insertMany(items, { ordered: false });
        return res.status(201).json({ insertedCount: docs.length, items: docs.map(mapArticleDoc) });
    } catch (err) {
        return next(err);
    }
}

async function apiUpdateOne(req, res, next) {
    try {
        if (!ensureMongo(res)) return;

        const { articleId } = req.params;
        if (!mongoose.isValidObjectId(articleId)) {
            return res.status(400).json({ error: `Invalid articleId: ${articleId}` });
        }

        const patch = req.body || {};
        if (!patch || Object.keys(patch).length === 0) {
            return res.status(400).json({ error: 'Body must contain fields to update' });
        }

        const result = await Article.updateOne({ _id: articleId }, { $set: patch }, { runValidators: true });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: `Article not found: ${articleId}` });
        }

        const updated = await Article.findById(articleId).lean();
        return res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, article: mapArticleDoc(updated) });
    } catch (err) {
        return next(err);
    }
}

async function apiReplaceOne(req, res, next) {
    try {
        if (!ensureMongo(res)) return;

        const { articleId } = req.params;
        if (!mongoose.isValidObjectId(articleId)) {
            return res.status(400).json({ error: `Invalid articleId: ${articleId}` });
        }

        const payload = req.body;
        if (!payload || typeof payload !== 'object' || Array.isArray(payload) || Object.keys(payload).length === 0) {
            return res.status(400).json({
                error: 'Request body is empty or invalid. Send JSON with Content-Type: application/json',
                example: { title: 'Replaced', author: 'team', body: 'Full doc' },
            });
        }

        const { title, author, body } = payload;
        if (!title) {
            return res.status(400).json({
                error: 'title is required for replaceOne',
                requiredFields: ['title'],
                receivedFields: Object.keys(payload),
            });
        }

        const replacement = { title, author, body };
        const result = await Article.replaceOne({ _id: articleId }, replacement, { runValidators: true });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: `Article not found: ${articleId}` });
        }

        const updated = await Article.findById(articleId).lean();
        return res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, article: mapArticleDoc(updated) });
    } catch (err) {
        return next(err);
    }
}

async function apiUpdateMany(req, res, next) {
    try {
        if (!ensureMongo(res)) return;

        const { filter, update } = req.body || {};
        if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
            return res.status(400).json({ error: 'filter object is required for updateMany' });
        }
        if (!update || typeof update !== 'object' || Array.isArray(update)) {
            return res.status(400).json({ error: 'update object is required for updateMany' });
        }

        const result = await Article.updateMany(filter, update, { runValidators: true });
        return res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
    } catch (err) {
        return next(err);
    }
}

async function apiDeleteOne(req, res, next) {
    try {
        if (!ensureMongo(res)) return;

        const { articleId } = req.params;
        if (!mongoose.isValidObjectId(articleId)) {
            return res.status(400).json({ error: `Invalid articleId: ${articleId}` });
        }

        const result = await Article.deleteOne({ _id: articleId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: `Article not found: ${articleId}` });
        }

        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
}

async function apiDeleteMany(req, res, next) {
    try {
        if (!ensureMongo(res)) return;

        const { filter } = req.body || {};
        if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
            return res.status(400).json({ error: 'filter object is required for deleteMany' });
        }

        const result = await Article.deleteMany(filter);
        return res.json({ deletedCount: result.deletedCount });
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    apiFindArticles,
    apiInsertOne,
    apiInsertMany,
    apiUpdateOne,
    apiReplaceOne,
    apiUpdateMany,
    apiDeleteOne,
    apiDeleteMany,
};

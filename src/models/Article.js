const { mongoose } = require('../db/mongoose');

const ArticleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        author: { type: String, default: 'editor', trim: true },
        body: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

// backend/src/models/UserArticleClick.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserArticleClickSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    clickedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserArticleClick', UserArticleClickSchema);

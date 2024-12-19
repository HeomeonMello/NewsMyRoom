// backend/src/models/News.js

const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    source: { type: String, required: true },
    date: { type: Date, required: true },
    language: { type: String, required: true },
    location: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 사용자 참조 추가
    savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);

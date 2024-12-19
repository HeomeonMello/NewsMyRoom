
// backend/src/models/SearchTerm.js

const mongoose = require('mongoose');

const searchTermSchema = new mongoose.Schema({
    term: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

module.exports = mongoose.model('SearchTerm', searchTermSchema);

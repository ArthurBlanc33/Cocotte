// models/article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    hashtags: String,
    mode: String,
    imagePath: String,
    date: {
        type: Date,
        default: Date.now
    } // Ajoutez cette ligne pour inclure la date de publication
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
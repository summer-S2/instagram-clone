const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    user: { type: Schema.ObjectId, required: true },
    article: { type: Schema.ObjectId, required: true },
})

module.exports = mongoose.model('Favorite', FavoriteSchema);
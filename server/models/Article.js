const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const ArticleSchema = new Schema({
    images: [{ type: String, required: true }], // 사진이 여러개
    description: { type: String }, // 사진 설명
    created: { type: Date, default: Date.now }, // 게시 날짜
    author: { type: Schema.ObjectId, required: true, ref: 'User' }, // 게시물 작성자
    favoriteCount: { type: Number, default: 0 },
})

// 보여주기용 날짜 생성
ArticleSchema.virtual('displayDate').get(function() {
    return DateTime
     .fromJSDate(this.created)
     .toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model('Article', ArticleSchema); // (모델이름,스키마)
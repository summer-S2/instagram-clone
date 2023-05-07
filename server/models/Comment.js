const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const CommentSchema = new Schema ({
    content: { type: String }, // 댓글 내용
    article: { type: Schema.ObjectId, required: true, }, // id: 어떤 게시물에 달린 댓글인지
    author: { type: Schema.ObjectId, required: true, ref: 'User' }, // 댓글 작성자
    created: { type: Date, default: Date.now },
})

// 보여주기용 날짜 생성
CommentSchema.virtual('displayDate').get(function() {
    return DateTime
      .fromJSDate(this.created)
      .toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model('Comment', CommentSchema); 
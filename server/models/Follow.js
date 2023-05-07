const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
    follower: { type: Schema.ObjectId, required: true, ref: 'User', },
    following: { type: Schema.ObjectId, required: true, ref: 'User', },
})

module.exports = mongoose.model('Follow', FollowSchema);
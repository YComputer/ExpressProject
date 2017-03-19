var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config').config;

var CommentSchema = new Schema({
    commentUser: { type: ObjectId },
    courseId: { type: ObjectId },
    workId: { type: ObjectId },
    commentTo: { type: ObjectId },
    commentType: { type: Number, default: 1 },  // 1:course; 2:work
    commentContent: { type: String },
    commentTime: { type: Date, default: Date.now }
});

CommentSchema.index({ commentType: 1 });

exports.CommentModel = mongoose.model('Comment', CommentSchema);
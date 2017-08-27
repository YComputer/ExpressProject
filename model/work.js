/**
 * Created by hr on 2016/12/20.
 */
var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config').config;

var WorkSchema = new Schema({
    name: { type: String },
    sourcePath: { type: String },
    description: { type: String },
    author: { type: ObjectId },
    uploadTime: { type: Date, default: Date.now },
    upCount: { type: Number, default: 0 },
    thumbsUp: { type: String, default: "" },
    pageViews: { type: Number, default: 0 }

});


WorkSchema.pre('save', function (next) {
    var now = new Date();
    this.uploadTime = now;
    next();
});

exports.workModel = mongoose.model('Work', WorkSchema);
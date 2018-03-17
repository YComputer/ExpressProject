var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config').config;

var UserRightSchema = new Schema({
    userId: { type: ObjectId },
    courseType: { type: Number, default: 1 },    //视频课程为1，直播课程为2
    courseId: { type: ObjectId },
    startTime: { type: Date, default: Date.now },
    validity: { type: Number, default: 30 }   //视频课程有效期30天，
});

exports.UserRightSchema = UserRightSchema;
exports.UserRightModel = mongoose.model('UserRight', UserRightSchema);
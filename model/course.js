var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var config = require('../config').config;

var CourseSchema = new Schema({
    title: { type: String },
    discription: { type: String },
    detialContentPath: { type: String },
    coursePrise: { type: Number, default: 0 },
    courseType: { type: Number, default: 1 },
    courseVideoPath: { type: String },
    watchCount: { type: Number, default: 0 },
    upCount: { type: Number, default: 0 },
    difficultyLevel: { type: Number, default: 1 },
    uploadTime: { type: Date, default: Date.now }
});


// CourseSchema.index({loginname: 1}, {unique: true});
// CourseSchema.index({email: 1}, {unique: true});
// CourseSchema.index({score: -1});
// CourseSchema.index({accessToken: 1});
CourseSchema.pre('save', function (next) {
    var now = new Date();
    this.uploadTime = now;
    next();
});


exports.CourseModel = mongoose.model('Course', CourseSchema);
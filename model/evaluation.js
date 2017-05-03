var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config').config;

var EvaluationSchema = new Schema({
    author: { type: ObjectId },
    work: { type: ObjectId },
    evaluationscore: { type: Number, default: 0 },
    time: { type: Date, default: Date.now }
});

exports.EvaluationModel = mongoose.model('Evaluation', EvaluationSchema);
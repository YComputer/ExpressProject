var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var config = require('../config').config;

var LabelSchema = new Schema({
    name: { type: String },
    discription: { type: String },
    dispName: { type: String }

});

exports.LabelSchema = LabelSchema;
exports.LabelModel = mongoose.model('Label', LabelSchema);
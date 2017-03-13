var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var config = require('../config').config;

var ArticalSchema = new Schema({
    title: { type: String},
    time:{ type: Date, default: Date.now }
});

exports.ArticalModel = mongoose.model('Artical', ArticalSchema);
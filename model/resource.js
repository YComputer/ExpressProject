/**
 *  Created by yaohw on 2017-03-20 23:37:00.
 */

var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var config = require('../config').config;

var ResourceSchema = new Schema({
    title: { type: String },
    description: { type: String },
    auth: { type: String },
    resourcePath: { type: String },
    resourceType: { type: Number, default: 1 },
    watchCount: { type: Number, default: 0 },
    praiseCount: { type: Number, default: 0 },
    uploadTime: { type: Date, default: Date.now }
});


ResourceSchema.pre('save', function (next) {
    var now = new Date();
    this.uploadTime = now;
    next();
});


exports.ResourceModel = mongoose.model('Resource', ResourceSchema);
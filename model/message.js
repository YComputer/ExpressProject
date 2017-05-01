/**
 * Created by yaohw on 2017-03-18 14:25:03.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BaseModel = require("./base_model");

var config = require('../config').config;

//留言板Schema
var MessageSchema = new Schema({
    title: { type: String },//主题
    content: { type: String },//内容
    author: { type: String },//作者
    email: { type: String },//邮箱
    tel: { type: String },//电话
    uploadTime: { type: Date, default: Date.now }//发布时间
});

//创建索引
MessageSchema.index({title: 1});

//保存前预处理
MessageSchema.pre('save', function (next) {
    var now = new Date();
    this.uploadTime = now;
    next();
});

exports.messageModel = mongoose.model('message', MessageSchema);
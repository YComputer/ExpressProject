/**
 * Created by yaohw on 2017-03-18 14:47:31.
 */

var MessageModel = require('../model/message').messageModel;
var utility = require('utility');
var uuid = require('uuid');


/**
 * 获取所有留言
 * @param callback
 */
exports.getAllMessage = function (callback) {
    MessageModel.find({}, callback);
}

/**
 * 获取指定用户的留言
 * @param callback
 */
exports.getAllMessageByUserId = function (id, callback) {
    MessageModel.find({ author: id }, null, { sort: [{ 'uploadTime': -1 }] }, callback);
}

/**
 * 获取最新的留言
 * @param
 */
exports.getLastNMessages = function (num, callback) {
    num = num > 10 ? num : 10;
    MessageModel.find({}, null, { sort: [{ 'uploadTime': -1 }] }, callback).limit(num);
}

/**
 * 获取单条留言
 * @param
 */
exports.getMessage = function (id, callback) {
    MessageModel.find({ _id: id }, callback);
}

/**
 * 保存留言信息
 * @param title:标题
 */
exports.saveMessage = function (title, content, author, email, tel, callback) {
    var message = new MessageModel();
    message.title = title;
    message.content = content;
    message.author = author;
    message.email = email;
    message.tel = tel;

    message.save(callback);
};

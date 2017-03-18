/**
 * Created by yaohw on 2017-03-18 15:24:16.
 */
var messageProxy = require('../proxy/message')
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");


/**
 * 显示所有留言
 */
exports.listAll = function (req, res, next) {

    messageProxy.getAllMessage(function (err, messages) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            res.render("composition/messages", {
                list: messages
            });
        }
    });
}

/**
 * 显示最新留言
 */
exports.listLastNMessages = function (req, res, next) {

    var num = req.params.num ? req.params.num : 10;

    messageProxy.getLastNMessages(num, function (err, messages) {
        if (err) {
            logger.error("查询最新留言失败：", err);
            res.send(err);
            return next(err);
        }
        else {
            res.render("composition/message", {
                list: messages
            });
        }
    });
}

/**
 * 显示指定留言
 */
exports.showMessage = function (req, res, next) {
    var id = req.params.messageid;
    messageProxy.getMessage(id, function (err, message) {
        if (err) {
            logger.error(err);
            res.render(err);
            return next(err);
        }
    })
}

/**
 * 发布留言
 */
// exports.publishMessage = function (req, res, next) {
//    var info = url.parse(req.url,true).query.name;
//     messageProxy.saveMessage(info,info,info,info,info,,function(err,messages){
//         if(err){
//             logger.error(err);
//             res.send(err);
//             return next(err);
//         }
//         else{
//             res.render("composition/messages", {
//                 list: messages
//             });
//          }
//     })
// }
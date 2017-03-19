var Comment = require('../proxy/comment');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var eventproxy = require('eventproxy');

exports.postComment = function (req, res, next) {
    var body = req.body;
    var commentType = body.type;
    var commentUser = req.cookies.user;
    var commentid = body.id;
    var commentTo = body.commentTo;
    var content = body.content;
    if (content == "" || content == undefined) {
        res.send(false);
        return;
    }
    Comment.saveComment(commentType, commentid, commentTo, content, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(false);
        }
        else {
            res.send(doc);
        }
    })
}
/**
 * Created by hr on 2016/12/19.
 */
var Work = require('../proxy/work');
var artical = require('../proxy/artical');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var eventproxy = require('eventproxy');
var Comment = require('../proxy/comment');
var moment = require('moment');

exports.listAll = function (req, res, next) {

    Work.getAllWork(function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            res.render("composition/works", {
                list: docs
            });
        }
    });
}

exports.showDetail = function (req, res, next) {
    var id = req.params.workid;
    var ep = new eventproxy();
    ep.all("work", "comments", function (work, comments) {
        res.render('composition/work', { work: work, commentList: comments });
    })

    Work.getdetail(id, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            ep.emit("work", docs[0]);
        }
    })
    Comment.getAllComments(2, id, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            var commentsList = new Array();
            for (var i = 0; i < docs.length; i++) {
                var doc = {}
                doc._id = docs[i]._id;
                doc.commentContent = docs[i].commentContent;
                doc.workId = docs[i].workId;
                doc.commentType = docs[i].commentType;
                doc.commentTime = moment(docs[i].commentTime).format('YYYY MMMM Do, hh:mm:ss a');
                commentsList.push(doc);
            }
            ep.emit("comments", commentsList);
        }
    })
}

exports.upload = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var name = files.file.name;

        var sourceFile = files.file.path;
        var destPath = path.join("F:\\ExpressProject\\public\\avatar\\", name);
        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);

        logger.info("收到文件：" + files);
        res.end();
    });
}


exports.getallartical = function (req, res, next) {
    artical.getall(function (docs) {
        res.send(docs);
        res.render("composition/works", { hello: docs[0].title });
    })
}
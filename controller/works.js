/**
 * Created by hr on 2016/12/19.
 */
var Work = require('../proxy/work');
var User = require('../proxy/user');
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
            var ids = [];
            for (var i = 0; i < docs.length; i++) {
                ids[i] = docs[i]._id;
            }
            User.getUsersByIds(ids, function (err1, users) {
                if (err1) {
                    logger.error(err);
                    res.send(err);
                    return next(err);
                }
                else {
                    var workList = new Array();
                    for (var j = 0; j < docs.length; j++) {
                        var work = {};
                        work._id = docs[j]._id;
                        work.name = docs[j].name;
                        work.upCount = docs[j].upCount;
                        work.author = docs[j].author;
                        var finduser = false;
                        for (var k = 0; k < users.length; k++) {
                            if ("" + work._id == "" + users[k]._id) {
                                work.authorName = users[k].name;
                                finduser = true;
                                break;
                            }
                        }
                        if (!finduser) {
                            work.authorName = "游客";
                        }
                        workList.push(work);
                        //work.description = docs[j].description;
                    }
                    res.render("composition/works", {
                        list: workList
                    });
                }
            })
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

exports.downLoad = function (req, res, next) {
    var id = req.params.workid;
    Work.getWorkSourcePath(id, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            res.download(doc[0].sourcePath, doc[0].name + '.sb2', function (err1) {
                if (err1) {
                    logger.error(err1);
                }
            });
        }
    })
}

exports.upload = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var name = files.file.name;

        var sourceFile = files.file.path;
        var destPath = process.cwd() + '/' + name;
        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        logger.info("收到文件：" + JSON.stringify(files));
        Work.newAndSave("name", destPath, "description", null, function (err, doc) {
            if (err) {
                logger.error(err);
                res.send(err);
                return next(err);
            }
            else {
                res.send({ id: doc._id });
            }
        });
    });
}

exports.saveWork = function (req, res, next) {
    var id = req.params.workid;
    var name = req.body.name;
    var description = req.body.description;
    Work.save(id, name, description, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            res.send(doc);
        }
    })
}


exports.getallartical = function (req, res, next) {
    artical.getall(function (docs) {
        res.send(docs);
        res.render("composition/works", { hello: docs[0].title });
    })
}
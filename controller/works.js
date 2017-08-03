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
var Evaluation = require('../proxy/evaluation');
var moment = require('moment');
var config = require('../config');

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
                    var Url = config.config.host;
                    res.render("composition/works", {
                        list: workList, Url: Url
                    });
                }
            })
        }
    });
}

exports.showDetail = function (req, res, next) {
    var id = req.params.workid;
    var ep = new eventproxy();
    ep.all("work", "comments", "Url", "evaluation", function (work, comments, Url) {
        res.render('composition/work', { work: work, commentList: comments, Url: Url });
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

    ep.emit("Url", config.config.host)

    Comment.getAllComments(2, id, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            var ids = [];
            for (var i = 0; i < docs.length; i++) {
                ids[i] = docs[i].commentUser;
            }

            User.getUsersByIds(ids, function (err1, users) {
                if (err1) {
                    logger.error(err);
                    res.send(err);
                    return next(err);
                }
                else {

                    var commentsList = new Array();
                    for (var i = 0; i < docs.length; i++) {
                        var doc = {}
                        doc._id = docs[i]._id;
                        var finduser = false;
                        for (var k = 0; k < users.length; k++) {
                            if ("" + docs[i].commentUser == "" + users[k]._id) {
                                doc.commentUser = users[k].name;
                                finduser = true;
                                break;
                            }
                        }
                        if (!finduser) {
                            doc.commentUser = "游客";
                        }
                        doc.commentContent = docs[i].commentContent;
                        doc.workId = docs[i].workId;
                        doc.commentType = docs[i].commentType;
                        doc.commentTime = moment(docs[i].commentTime).format('YYYY MMMM Do, hh:mm:ss a');
                        doc.index = i;
                        commentsList.push(doc);
                    }
                    ep.emit("comments", commentsList);
                }
            })
        }
    })
    Evaluation.findByWorkId(id, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            if (docs != undefined && docs.length > 0) {
                ep.emit("evaluation", docs[0]);
            }
            else {
                ep.emit("evaluation", {});
            }
        }
    })
}
exports.showFull = function (req, res, next) {
    var id = req.params.workid;
    var ep = new eventproxy();
    ep.all("work", "comments", "Url", function (work, comments, Url) {
        res.render('composition/showfullScreen', { work: work, commentList: comments, Url: Url });
    })

    ep.emit("Url", config.config.host)
    
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

exports.showEvaluation = function (req, res, next) {
    var id = req.params.workid;
    Evaluation.findByWorkId(id, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            if (docs != undefined && docs.length > 0) {
                res.render("composition/evaluation", { evaluation: docs[0] });
            }
            else {
                res.render("composition/evaluation", { evaluation: {} });
            }
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
            var url = path.resolve('./');
            res.download(config.config.project_base_path + doc[0].sourcePath, doc[0].name + '.sb2', function (err1) {
                if (err1) {
                    logger.error(err1);
                    res.send(err1);
                }
            });
        }
    })
}

exports.upload = function (req, res, next) {
    var form = new formidable.IncomingForm();
    var userId = undefined;
    if (req.session.user) {
        userId = req.session.user._id;
    }
    else {
        userId = null;
    }
    form.parse(req, function (err, fields, files) {
   

        var filename;
        Work.newAndSave("name", "relativeDestPath", "description", userId, function (err, doc) {
            if (err) {
                logger.error(err);
                res.send(err);
                return next(err);
            }
            else {
                filename = doc._id.toString();
                res.send({ id: doc._id });
                var sourceFile = files.file.path;
                var url = path.resolve('./');
                var relativeDestPath = "public/avatar/" + filename+".sb2";
                var destPath = config.config.project_base_path + relativeDestPath;
                var readStream = fs.createReadStream(sourceFile);
                var writeStream = fs.createWriteStream(destPath);
                readStream.pipe(writeStream);
                logger.info("收到文件：" + JSON.stringify(files));
            }
        });
        

    });
}

exports.saveWork = function (req, res, next) {
    var id = req.params.workid;
    var name = req.body.name;
    var relativeDestPath = "public/avatar/" + req.body.relativeDestPath+".sb2";
    var description = req.body.description;
    var ep = new eventproxy();
    ep.all("saved", "evaluated", function (work, evaluated) {
        res.send(work);
    })

    Work.save(id, relativeDestPath, name, description, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            ep.emit("saved", doc);
        }
    })
    Evaluation.newAndSave("", id, 10, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            ep.emit("evaluated", true);
        }
    })
}

exports.getNextPage = function (req, res, next) {
    var pageId = req.query.pageid;

    Work.getNextPageWorks(pageId, function (err, docs) {
        if (err) {
            res.send({ err: JSON.stringify(err) });
        }
        else {
            res.send({ data: docs });
        }
    })
}

exports.getTotalCount = function (req, res, next) {
    Work.getTotalCount(function (err, doc) {
        if (err) {
            res.send({ err: JSON.stringify(err) });
        }
        else {
            res.send({ data: doc });
        }
    })
}
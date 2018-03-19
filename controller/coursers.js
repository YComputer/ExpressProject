var Course = require('../proxy/course');
var Comment = require('../proxy/comment');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var eventproxy = require('eventproxy');
var moment = require('moment');
var userRight = require('../proxy/userRight');

exports.addLabel = function (req, res, next) {
    var name = req.query.name;
    var discription = req.query.discription;
    var dispName = req.query.dispName;
    Course.newLabel(name, dispName, discription, function (err) {
        if (err) {
            res.send(err);
        }
        res.send("new label added.")
    })
}

exports.addCourse = function (req, res, next) {
    var title = req.query.title;
    var discription = req.query.discription;
    var detialContentPath = req.query.detialContentPath;
    var coursePrise = req.query.coursePrise;
    var courseType = req.query.courseType;
    var courseVideoPath = req.query.courseVideoPath;
    var labels = req.query.labels;
    Course.getLabel(labels, function (err, docs) {
        if (err) {
            res.send(err);
        }
        Course.addNewCourse(title, discription, detialContentPath,
            coursePrise, courseType, courseVideoPath, docs, function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("添加成功")
                }
            })
    })

}

exports.listAllCourse = function (req, res, next) {
    var courseType = req.params.courseType;
    Course.listAllCourse(courseType, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            res.render("course/courses", {
                list: docs, coursetype: courseType
            });
        }
    });

}

exports.getAllCourse = function (req, res, next) {
    var label = req.params.selectedLabel;
    var searchParameter = req.params.searchParameter;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        logger.error(msg);
        res.send({ error: msg });
    });
    ep.all('getLabelFinished', "getCoursesFinished", function (labels, labelCourses) {
        logger.info(JSON.stringify(labels));
        logger.info(JSON.stringify(labelCourses));
        res.render("course/courses_new", { labels: labels, labelCourses: labelCourses });
    });

    Course.getAllLabels(function (err, labels) {
        if (err) {
            logger.error('获取标签列表失败');
            ep.emit("prop_err", "获取标签列表失败");
        }
        else {
            ep.emit("getLabelFinished", labels);
            var courseEP = new eventproxy();
            courseEP.after('getPopularCourseByLabel', labels.length, function (labelCourses) {
                ep.emit('getCoursesFinished', labelCourses);
            })
            for (let i = 0; i < labels.length; i++) {
                Course.getCourseByLabel(labels[i], 5, function (err, docs) {
                    if (err) {
                        logger.error(err);
                        ep.emit("prop_err", "获取标签下的优秀课程失败");
                    }
                    else {
                        var labelCourse = {
                            label: labels[i],
                            couses: docs
                        };
                        courseEP.emit('getPopularCourseByLabel', labelCourse);
                    }
                });
            }
        }
    })
}

exports.scratchpage = function (req, res, next) {
    res.render('course/scratch');
}

exports.getCourseDescriptionById = function (req, res, next) {
    var courseId = req.params.courseId;
    Course.getCourseDetail(courseId, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info(docs[0]);
            res.send(docs[0].discription);
        }
    })
}

exports.viewCourse = function (req, res, next) {
    var courseId = req.params.courseid;
    Course.getCourseById(courseId, function (err, doc) {
        if (err) {
            res.render("error");
        }
        else {
            logger.info(doc);
            res.render('course/course', { course: doc, commentList: [] });
        }
    })
}

exports.checkUserCourseRight = function (req, res, next) {
    var courseId = req.params.courseid;
    if (!req.session.user) {
        res.send("false");
    }
    else {
        var userId = req.session.user._id;
        userRight.checkRight(userId, courseId, 1, function (err, docs) {
            if (err) {
                logger.error("获取用户对课程的权限失败", err);
                res.send("false");
            }
            else if (docs.length == 0) {
                res.send("false");
            }
            else {
                res.send("true");
            }
        })
    }

}

exports.getCourseInfoById = function (req, res, next) {
    var courseId = req.query.courseid;
    Course.getCourseDetail(courseId, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info(docs[0]);
            res.send(docs[0]);
        }
    })
}

exports.showCourseDetail = function (req, res, next) {
    var courseId = req.params.courseId;
    var ep = new eventproxy();
    ep.all("courseDetail", "comments", function (course, comments) {
        res.render("course/course", { course: course, commentList: comments });
    })
    Course.getCourseDetail(courseId, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info(docs[0]);
            ep.emit("courseDetail", docs[0]);
        }
    })
    Comment.getAllComments(1, courseId, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info(docs);
            var commentsList = new Array();
            for (var i = 0; i < docs.length; i++) {
                var doc = {}
                doc._id = docs[i]._id;
                doc.commentContent = docs[i].commentContent;
                doc.courseId = docs[i].courseId;
                doc.commentType = docs[i].commentType;
                doc.commentTime = moment(docs[i].commentTime).format('YYYY MMMM Do, hh:mm:ss a');
                doc.index = i;
                commentsList.push(doc);
            }
            ep.emit("comments", commentsList);
        }
    })
}

exports.getLableCourses = function (req, res, next) {
    var lableId = req.params.lableid;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        logger.error(msg);
        res.send({ error: msg });
    });
    ep.all('getLabelFinished', "getCoursesFinished", function (labels, labelCourses) {
        logger.info(JSON.stringify(labels));
        logger.info(JSON.stringify(labelCourses));
        res.render("course/courseLableSearch", { labels: labels, courses: labelCourses });
    });

    Course.getAllLabels(function (err, labels) {
        if (err) {
            logger.error('获取标签列表失败');
            ep.emit("prop_err", "获取标签列表失败");
        }
        else {
            ep.emit("getLabelFinished", labels);
        }
    })

    Course.getLableById(lableId, function (err, doc) {
        if (err) {
            logger.error("获取标签相关课程失败", err);
            res.render('error');
        }
        else {
            Course.getCourseByLabel(doc, 1000, function (err, docs) {
                if (err) {
                    logger.error("获取标签相关课程失败", err);
                    res.render('error');
                }
                else {
                    ep.emit('getCoursesFinished', docs);
                }
            })
        }
    })


}

exports.searchCourseByKeywords = function (req, res, next) {
    var keywords = req.query.keywords;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        logger.error(msg);
        res.send({ error: msg });
    });
    ep.all('getLabelFinished', "getCoursesFinished", function (labels, labelCourses) {
        logger.info(JSON.stringify(labels));
        logger.info(JSON.stringify(labelCourses));
        res.render("course/courseLableSearch", { labels: labels, courses: labelCourses });
    });

    Course.getAllLabels(function (err, labels) {
        if (err) {
            logger.error('获取标签列表失败');
            ep.emit("prop_err", "获取标签列表失败");
        }
        else {
            ep.emit("getLabelFinished", labels);
        }
    })

    if (keywords == "") {
        Course.getAllCourse(function (err, docs) {
            if (err) {
                logger.error(err);
            }
            else {
                ep.emit('getCoursesFinished', docs);
            }
        });
    }
    else {
        Course.getCourseByKeywords(keywords, function (err, docs) {
            if (err) {
                logger.error(err);
            }
            else {
                ep.emit('getCoursesFinished', docs);
            }
        });
    }


}
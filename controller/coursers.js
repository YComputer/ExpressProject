var Course = require('../proxy/course');
var Comment = require('../proxy/comment');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var eventproxy = require('eventproxy');
var moment = require('moment');

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
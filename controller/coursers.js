var Course = require('../proxy/course');
//var artical = require('../proxy/artical');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");

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
                list: docs
            });
        }
    })
}

exports.showCourseDetail = function (req, res, next) {
    var courseId = req.params.courseId;
    Course.getCourseDetail(courseId, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info(docs[0]);
            res.render("course/course", { course: docs[0] });
        }
    })
}
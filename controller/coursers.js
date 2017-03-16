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
            res.render("course/course", {
                list: docs
            });
        }
    })
}
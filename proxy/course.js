var CourseModel = require('../model/course').CourseModel;
var utility = require('utility');
var uuid = require('uuid');

exports.listAllCourse = function (_courseType, callback) {
    if (_courseType == undefined) {
        _courseType = 1;
    }
    _courseType = parseInt(_courseType);
    CourseModel.find({ courseType: _courseType }, callback);
};

exports.getCourseDetail = function (_courseId, callback) {
    CourseModel.find({ _id: _courseId }, callback);
}
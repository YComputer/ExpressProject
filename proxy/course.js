var CourseModel = require('../model/course').CourseModel;
var LabelModel = require('../model/label').LabelModel;
var utility = require('utility');
var uuid = require('uuid');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;

exports.listAllCourse = function (_courseType, callback) {
    if (_courseType == undefined) {
        _courseType = 1;
    }
    _courseType = parseInt(_courseType);
    CourseModel.find({ courseType: _courseType }, callback);
};

exports.getCourseDetail = function (_courseId, callback) {
    CourseModel.find({ _id: _courseId }, callback);
};

exports.getAllLabels = function (callback) {
    LabelModel.find({}, callback);
}

exports.newLabel = function (name, dispName, discription, callback) {
    var lable = new LabelModel();
    lable.name = name;
    lable.dispName = dispName;
    lable.discription = discription;
    lable.save(callback);
}

exports.getLabel = function (name, callback) {
    LabelModel.find({ name: name }, {}, callback);
}

exports.getCourseByLabel = function (lable, number, callback) {
    //sort: { watchCount: -1 },
    //CourseModel.find({ 'lables.lableName': { '$in': [lable.name] } }, { limit: number }, callback);
    // CourseModel.$where(lable.name, function () {
    //     if (this.lables == undefined || this.lables == null || this.lables.length == 0) {
    //         return 0;
    //     }
    //     for (var i = 0; i < this.lables.length; i++) {
    //         if (this.lables[i].lableName == lable) {
    //             return 1;
    //         }
    //     }
    //     return 0;
    // }).limit(number).exec(callback);
    CourseModel.where({ 'lables.lableName': lable.name }).limit(number).exec(callback);
}

exports.getCourseById = function (id, callback) {
    CourseModel.findById(id, callback);
}

exports.addNewCourse = function (title, discription, detialContentPath,
    coursePrise, courseType, courseVideoPath, labels, callback) {
    var course = new CourseModel();
    course.title = title;
    course.discription = discription;
    course.detialContentPath = detialContentPath;
    course.coursePrise = coursePrise;
    course.courseType = courseType;
    course.courseVideoPath = courseVideoPath;
    course.lables = [{ lableid: labels[0]._id, lableName: labels[0].name }];
    course.save(callback);
}
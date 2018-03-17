var UserRightModel = require('../model/user_right').UserRightModel;
var utility = require('utility');
var uuid = require('uuid');

exports.addRight = function (userId, courseType, courseId, callback) {
    var userRight = new UserRightModel();
    userRight.userId = userId;
    userRight.courseId = courseId;
    userRight.courseType = courseType;
    userRight.save(callback);
}

exports.checkRight = function (userId, courseId, courseType, callback) {
    UserRightModel.find({ userId: userId, courseId: courseId, courseType: courseType }, callback);
}
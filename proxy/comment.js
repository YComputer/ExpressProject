var CommentModel = require('../model/comment').CommentModel;
var utility = require('utility');
var uuid = require('uuid');

exports.getAllComments = function (commentType, id, callback) {
    if (parseInt(commentType) == 1) {
        CommentModel.find({ commentType: 1, courseId: id }, callback);
    }
    else if (parseInt(commentType) == 2) {
        CommentModel.find({ commentType: 2, workId: id }, callback);
    }

    //{ sort: [{ 'commentTime': -1 }] }, 
}

exports.saveComment = function (commentType, id, commentTo, content, callback) {
    var comment = new CommentModel();
    var type = parseInt(commentType);
    comment.commentType = type;
    if (type == 1) {
        comment.courseId = id;
    }
    else if (type == 2) {
        comment.workId = id;
    }
    comment.commentContent = content;
    if (commentTo != undefined && commentTo != "") {
        comment.commentTo = commentTo;
    }
    comment.save(callback);
}
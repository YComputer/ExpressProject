var Evaluation = require('../model/evaluation').EvaluationModel;
var utility = require('utility');
var uuid = require('uuid');

exports.newAndSave = function (author, work, evaluationscore, callback) {
    var evaluation = new Evaluation();
    //evaluation.author = author;
    evaluation.work = work;
    evaluation.evaluationscore = evaluationscore;
    evaluation.save(callback);
}

exports.findByWorkId = function (workId, callback) {
    Evaluation.find({ work: workId }, callback);
}

exports.findByAuthorId = function (authorId, callback) {
    Evaluation.find({ author: authorId }, callback);
}
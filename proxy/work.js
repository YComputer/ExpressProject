/**
 * Created by hr on 2016/12/22.
 */
/**
 * Created by hr on 2016/11/23.
 */
var Work = require('../model/work').workModel;
var utility = require('utility');
var uuid = require('uuid');


/**
 * 获取所有作品
 * @param callback
 */
exports.getAllWork = function (callback) {
    this.getNextPageWorks(0, callback);
    //Work.find({}, callback);
}

exports.getTotalCount = function (callback) {
    Work.count({}, callback);
}

exports.getNextPageWorks = function (pageid, callback) {
    var query = Work.find({});
    query.skip(pageid * 20);
    query.limit(20)
    query.exec(callback);
}

exports.getAllWorkByUserId = function (id, callback) {
    Work.find({ author: id }, null, { sort: [{ 'uploadTime': -1 }] }, callback);
}

exports.getWorkSourcePath = function (id, callback) {
    Work.find({ _id: id }, 'sourcePath name', callback);
}

exports.getdetail = function (id, callback) {
    Work.find({ _id: id }, callback);
}

exports.newAndSave = function (name, path, description, author, callback) {
    var work = new Work();
    work.name = name;
    work.sourcePath = path;
    work.description = description;
    work.author = author;
    work.save(callback);
};

exports.save = function (id, name, description, callback) {
    Work.findById(id, function (err, work) {
        if (err) {
            return;
        }
        else {
            work.name = name;
            work.description = description;
            work.save(callback);
        }
    })
}

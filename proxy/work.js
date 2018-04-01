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
    var query = Work.find({}).sort({ viewCount: -1 });
    query.skip(pageid * 20);
    query.limit(20)
    query.exec(callback);
}

exports.getWorkByid = function (workid, callback) {
    Work.findById(workid, callback);
}


exports.getAllWorkByUserId = function (userId, callback) {
    var query = Work.find({ author: userId });
    query.exec(callback);
}

exports.findAllWorkByKeyword = function (keyword, pageid, callback) {
    var reg = new RegExp(keyword, 'i');
    var query = Work.find({ name: { $regex: reg } });
    query.skip(pageid * 20);
    query.limit(20);
    query.exec(callback);
}

exports.getWorkSourcePath = function (id, callback) {
    Work.find({ _id: id }, 'sourcePath name', callback);
}

exports.getdetail = function (id, callback) {
    Work.find({ _id: id }, callback);
}

exports.newAndSave = function (name, path, description, authorID, authorName, callback) {
    var work = new Work();
    work.name = name;
    work.sourcePath = path;
    work.description = description;
    work.authorID = authorID;
    work.authorName = authorName;
    work.save(callback);
};

exports.save = function (id, path, name, description, callback) {
    Work.findById(id, function (err, work) {
        if (err) {
            return;
        }
        else {
            work.sourcePath = path;
            work.name = name;
            work.description = description;
            work.save(callback);
        }
    })
};

/**
 * 点赞
 */
exports.thumbsUp = function (workId, userName, callback) {
    Work.findById(workId, function (err, work) {
        if (err) {
            return;
        }
        else {

            //点赞数量+1，点赞人增加当前用户
            work.upCount += 1;
            work.thumbsUp += userName + ";";

            work.save(callback);
        }
    })
}

exports.addViewCount = function (workId) {
    Work.findById(workId, function (err, work) {
        if (err) {
            return;
        }
        else {
            work.viewCount += 1;
            work.save(function (err, doc) {
                if (err) {
                    return;
                }
                else {
                    return;
                }
            });
        }
    })
}

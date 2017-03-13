/**
 * Created by hr on 2016/12/22.
 */
/**
 * Created by hr on 2016/11/23.
 */
var Work    = require('../model/work').workModel;
var utility = require('utility');
var uuid    = require('uuid');


/**
 * 获取所有作品
 * @param callback
 */
exports.getAllWork = function (callback) {
        Work.find({},callback);
}

exports.getAllWorkByUserId = function ( id, callback) {
    Work.find({author:id},null,{sort:[{'uploadTime':-1}]},callback);
}

exports.newAndSave = function (name, path, description, author, callback) {
    var work            = new Work();
    work.name           = name;
    work.sourcePath     = path;
    work.description    = description;
    work.author         = author;
    work.save(callback);
};

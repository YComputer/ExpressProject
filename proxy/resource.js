/**
 * create by yaohw@2017-03-20 23:47:44
 */

var ResourceModel = require('../model/resource').ResourceModel;
var utility = require('utility');
var uuid = require('uuid');

/**
 * 通过资源类型查询所有资源
 */
exports.listAllResource = function (_resourceType, callback) {
    if (_resourceType == undefined) {
        _resourceType = 1;
    }
    _resourceType = parseInt(_resourceType);
    ResourceModel.find({ resourceType: _resourceType }, callback);
};

/**
 * 获取资源详细信息
 */
exports.getResourceDetail = function (_resourceId, callback) {
    ResourceModel.find({ _id: _resourceId }, callback);
}

/**
 * 保存资源到数据库
 *  title: { type: String },
    discription: { type: String },
    auth: { type: String },
    resourcePath: { type: String },
    resourceType: { type: Number, default: 1 },
    watchCount: { type: Number, default: 0 },
    praiseCount: { type: Number, default: 0 },
    uploadTime: { type: Date, default: Date.now }
 */
exports.saveResource = function (title, discription, auth, resourcePath, resourceType, callback) {
    var resource = new ResourceModel();

    resource.title = title;
    resource.discription = discription;
    resource.auth = auth;
    resource.resourceType = parseInt(resourceType);;
    resource.resourcePath = resourcePath;

    resource.save(callback);
}
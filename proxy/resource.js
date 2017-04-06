/**
 * create by yaohw@2017-03-20 23:47:44
 */

var ResourceModel = require('../model/resource').ResourceModel;
var utility = require('utility');
var uuid = require('uuid');

/** 通过资源类型查询所有资源
 * 
 */
exports.listAllResource = function (_resourceType, callback) {
    if (_resourceType == undefined) {
        _resourceType = 1;
    }
    _resourceType = parseInt(_resourceType);

    if (_resourceType == 1) {
        ResourceModel.find(callback);
    } else {
        ResourceModel.find({ resourceType: _resourceType }, callback);
    }


};

/** 获取资源详细信息
 * 
 */
exports.getResourceDetail = function (_resourceId, callback) {
    ResourceModel.find({ _id: _resourceId }, callback);
}

/** 保存资源到数据库 
 *  id: { type: String },
 *  title: { type: String },
    description: { type: String },
    auth: { type: String },
    resourcePath: { type: String },
    resourceType: { type: Number, default: 1 },
    watchCount: { type: Number, default: 0 },
    praiseCount: { type: Number, default: 0 },
    uploadTime: { type: Date, default: Date.now }
 */
exports.saveResource = function (id, title, description, auth, resourceType, resourcePath, callback) {

    var resource;
    //id为空则直接新增，否则为更新
    if (id) {
        ResourceModel.findById(id, function (err, resource) {
            if (err) {
                return;
            }
            else {
                if (title) {
                    resource.title = title;
                }

                if (description) {
                    resource.description = description;
                }

                if (auth) {
                    resource.auth = auth;
                }

                if (resourceType) {

                    resource.resourceType = resourceType;
                }

                if (resourcePath) {
                    resource.resourcePath = resourcePath;
                }


                resource.save(callback);
            }
        })
    } else {
        resource = new ResourceModel();

        resource.title = title;
        resource.description = description;
        resource.auth = auth;
        resource.resourceType = parseInt(resourceType);;
        resource.resourcePath = resourcePath;

        resource.save(callback);

    }

}
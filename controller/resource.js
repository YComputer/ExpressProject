/**
 * create by yaohw@2017-03-21 00:05:53
 */

var Resource = require('../proxy/resource');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var eventproxy = require('eventproxy');

/**
 * 显示资源列表
 */
exports.listAllResource = function (req, res, next) {
    var resourceType = req.params.resourceType;
    if (resourceType == undefined) {
        resourceType = 1;
    }
    resourceType = parseInt(resourceType);

    Resource.listAllResource(resourceType, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info(docs[0]);
            res.render("resource/resources", docs);
        }
    })
}

/**
 * 显示资源详细信息
 */
exports.showResourceDetail = function (req, res, next) {
    var resourceId = req.params.resourceId;
    Resource.getResourceDetail(resourceId, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info(docs[0]);
            res.render("resource/resource/:resourceId", docs[0]);
        }
    })
}

/**
 * 保存资源
 */
exports.saveResource = function (req, res, next) {
    var body = req.body;

    resource.title = title;
    resource.discription = discription;
    resource.auth = auth;
    resource.resourceType = parseInt(resourceType);;
    resource.resourcePath = resourcePath;

    var title = body.title;
    var discription = body.discription;
    var auth = body.auth;
    var resourceType = body.resourceType;
    var resourcePath = body.resourcePath;

    Resource.saveResource(title, discription, auth, resourceType, resourcePath, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(false);
        }
        else {
            res.send(doc);
        }
    })
}
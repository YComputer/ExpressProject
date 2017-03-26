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
            res.render("resource/resources", {
                list: docs, resourceType: resourceType
            });
        }
    })
}

/**
 * 显示资源详细信息
 */
exports.showResourceDetail = function (req, res, next) {
    var resourceId = req.params.resourceId;
    var resourceType = req.params.resourceType;
    
    Resource.getResourceDetail(resourceId, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info(docs[0]);
            res.render("resource/resource", { resource: docs[0] });
        }
    })
}

/**
 * 上传资源文件
 */
exports.upload = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var name = files.file.name;

        var sourceFile = files.file.path;
        var destPath = process.cwd() + '/' + name;
        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        logger.info("收到文件：" + JSON.stringify(files));
        Resource.saveResource("", name, "description", "auth", "1", destPath, function (err, doc) {
            if (err) {
                logger.error(err);
                res.send(err);
                return next(err);
            }
            else {
                res.send({ id: doc._id });
            }
        });
    });
}


/**
 * 保存资源
 */
exports.saveResource = function (req, res, next) {
    var id = req.params.resourceId;
    var body = req.body;

    var title = body.resourceName;
    var discription = body.description;
    var auth = body.auth;
    var resourceType = body.resourceType;
    var resourcePath = body.resourcePath;

    Resource.saveResource(id, title, discription, auth, resourceType, resourcePath, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(false);
        }
        else {
            res.send(doc);
        }
    })
}
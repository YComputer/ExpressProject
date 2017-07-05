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
var config = require('../config');

/**显示资源列表
 * 
 */
exports.listAllResource = function (req, res, next) {
    var resourceType = req.params.resourceType;
    if (resourceType == undefined||resourceType == NaN) {
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

/**显示资源详细信息
 * 
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

/**上传资源文件
 * 
 */
exports.upload = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var name = files.file.name;

        var sourceFile = files.file.path;
        var relativeDestPath =  '/public/resources/' + name;
        var destPath = config.config.project_base_path + relativeDestPath;
        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        logger.info("收到文件：" + JSON.stringify(files));
        Resource.saveResource("", name, "description", "auth", "1", name, function (err, doc) {
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


/**保存资源
 * 
 */
exports.saveResource = function (req, res, next) {
    var id = req.params.resourceId;
    var body = req.body;

    var title = body.resourceName;
    var description = body.description;
    var auth = body.auth;
    var resourceType = body.resourceType;
    var resourcePath = body.resourcePath;

    Resource.saveResource(id, title, description, auth, resourceType, resourcePath, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(false);
        }
        else {
            res.send(doc);
        }
    })
}

exports.download = function (req, res, next) {
    var id = req.params.resourceId;
    Resource.getResourceDetail(id, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            res.download(config.config.project_base_path + '/../public/resource/' + doc[0].resourcePath, function (err1) {
                if (err1) {
                    logger.error(err1);
                     res.send(err1);
                }
            });
        }
    })
}
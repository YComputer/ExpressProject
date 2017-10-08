/**
 * Created by hr on 2016/12/19.
 */

var Work = require('../proxy/work');
var User = require('../proxy/user');
var artical = require('../proxy/artical');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var eventproxy = require('eventproxy');
var Comment = require('../proxy/comment');
var Evaluation = require('../proxy/evaluation');
var moment = require('moment');
var config = require('../config');
var tools = require('../common/tools');

exports.upload = function (req, res, next) {


    var userId = undefined;
    if (req.session.user) {
        userId = req.session.user._id;
    }
    else {
        userId = null;
    }

    Work.newAndSave("name", "relativeDestPath", "description", userId, "游客", function (err, doc) {
        if (err) {
            logger.info("出现错误");
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            logger.info("数据库新建成功");
            var resId = doc._id.toString();
            logger.info("新的id" + resId);
            //////////////////////
            var name = req.body.name;
            var description = req.body.description;

            var picdata = req.body.picdata;
            var programdata = req.body.programdata

            logger.info("参数取完毕");

            var folder1 = config.config.project_base_path + "public/thumbnail/";
            var folder2 = config.config.project_base_path + "public/avatar/";


            fs.stat(folder1, function (err, stat) {
                if (err) {
                    fs.mkdir(folder1, 0777, function () {
                        save1(resId, picdata, res);
                    });
                } else {
                    save1(resId, picdata, res);
                }
            })


            fs.stat(folder2, function (err, stat) {
                if (err) {
                    fs.mkdir(folder2, 0777, function () {
                        save2(resId, programdata, res);
                    });
                } else {
                    save2(resId, programdata, res);
                }
            })


            var id = resId;
            var relativeDestPath = "public/avatar/" + id + ".sb2";

            Work.save(id, relativeDestPath, name, description, function (err, doc) {
                if (err) {
                    logger.error(err);
                    res.send(err);
                    return next(err);
                }
            })

            res.send("ok");
        }
    });
    //readStream.pipe(writeStream);

}

var save1 = function (resId, picdata, res) {
    var relativeDestPath = "public/thumbnail/" + resId + ".png";
    //var url = path.resolve('./');
    var destPath = config.config.project_base_path + relativeDestPath;

    var dataBuffer = new Buffer(picdata, 'base64');
    fs.writeFile(destPath, dataBuffer, function (err) {
        if (err) {
            logger.error("保存缩略图失败", err);
        }
        else {
            logger.info("已保存缩略图：" + destPath);
        }
        //res.end({});
    });
}


var save2 = function (resId, programdata, res) {
    var relativeDestPath = "public/avatar/" + resId + ".sb2";
    //var url = path.resolve('./');
    var destPath = config.config.project_base_path + relativeDestPath;

    var dataBuffer = new Buffer(programdata, 'base64');
    fs.writeFile(destPath, dataBuffer, function (err) {
        if (err) {
            logger.error("保存程序失败", err);
        }
        else {
            logger.info("已保存程序：" + destPath);
        }
        //res.end({});
    });
}


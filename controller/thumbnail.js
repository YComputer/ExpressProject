/**
 * Created by hr on 2016/12/19.
 */

var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var eventproxy = require('eventproxy');
var moment = require('moment');


exports.upload = function (req, res, next) {

    var resId = req.body.responseId;
    var picdata = req.body.imageData;
    var folder = path.resolve('./') + "/.." + "/public/thumbnail/";
    fs.stat(folder, function (err, stat) {
        if (err) {
            fs.mkdir(folder, 0777, function () {
                save(resId, picdata, res);
            });
        } else {
            save(resId, picdata, res);
        }
    })

    //readStream.pipe(writeStream);

}

var save = function (resId, picdata, res) {
    var relativeDestPath = "/public/thumbnail/" + resId + ".png";
    var url = path.resolve('./');
    var destPath = url + '/..' + relativeDestPath;

    var dataBuffer = new Buffer(picdata, 'base64');
    fs.writeFile(destPath, dataBuffer, function (err) {
        if (err) {
            logger.error("保存缩略图失败", err);
        }
        else {
            logger.info("已保存缩略图：" + destPath);
        }
        res.end({});
    });
}


/**
 * Created by hr on 2016/11/29.
 */
var logger = require('../common/logger');
var config     = require('../config');
var url = require("url");
var Work = require('../proxy/work');
var eventproxy = require('eventproxy');
var fs = require("fs");
var path = require("path");

exports.remix = function (req, res, next) {
    var id = req.params.workid;
    var ep = new eventproxy();
    ep.all("work", "pathx",  "Url", function (work, pathx, Url) {
        res.render('remix', { work: work, pathx: pathx, Url: Url });
    })

    ep.emit("Url", config.config.host)

    Work.getWorkSourcePath(id, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            var url = path.resolve('./');
             ep.emit("pathx", config.config.project_base_path + doc[0].sourcePath, doc[0].name + '.sb2');
        }
    });

    Work.getdetail(id, function (err, docs) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            ep.emit("work", docs[0]);
        }
    })
}
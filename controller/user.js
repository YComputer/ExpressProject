/**
 * Created by hr on 2016/11/23.
 */
var User = require('../proxy/user');
var Work = require('../proxy/work');
var logger = require('../common/logger');
var eventproxy = require('eventproxy');
var url = require("url");

exports.create = function (req, res, next) {
    var user_name = url.parse(req.url, true).query.name;
    User.newAndSave(user_name, user_name, user_name, user_name, user_name, null, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else {
            res.send(doc);
        }
    })
}

exports.listInfo = function (req, res, next) {
    if (req.session.user == undefined) {
        res.render('sign/newSignin');
        return;
    }
    var user_id = req.session.user._id;
    if (user_id == undefined) {
        res.render('sign/newSignin');
        return;
    }

    var ep = new eventproxy();
    ep.fail(next);
    //var renderData={};
    ep.all('searchuserinfofinished', "searchworkfinished", function (userinfo, works) {
        logger.info(userinfo.loginname);
        res.render("user/user", { me: userinfo, myworks: works });
    });

    //查找基本信息
    User.getUserById(user_id, function (err, doc) {
        if (err) {
            logger.error("查找用户信息失败：", err);
        }
        //renderData["userinfo"] = doc;
        ep.emit('searchuserinfofinished', doc);
    });

    //查找用户的作品
    Work.getAllWorkByUserId(user_id, function (err, docs) {
        if (err) {
            logger.error("查找用户作品失败：", err);
        }
        //renderData["postedworkes"] = docs;
        ep.emit('searchworkfinished', docs);
    })
}

exports.updateInfo = function (req, res, next) {
    if (req.session.user == undefined) {
        res.render('sign/newSignin');
        return;
    }
    var user_id = req.session.user._id;
    if (user_id == undefined) {
        res.render('sign/newSignin');
        return;
    }

    var name = req.query.name;
    var sex = req.query.sex;
    var birth = req.query.birth;
    var school = req.query.school;
    var gread = req.query.gread;

    User.updateUserInfo(user_id, name, sex, 12, Date.now(), "法师打发", "江苏", "南京", "育才中学", "初一", "13776416562", function (err, data) {
        if (err) {
            res.send(false);
        }
        else {
            res.send(true);
        }
    })


}
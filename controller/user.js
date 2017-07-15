/**
 * Created by hr on 2016/11/23.
 */
var User = require('../proxy/user');
var Work = require('../proxy/work');
var logger = require('../common/logger');
var eventproxy = require('eventproxy');
var url = require("url");
var clone = require('../common/tools').clone;

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
        var user = {
            _id: doc._id,

        };
        // if (doc.UserInfo.sex == 1)
        //     user.userInfo.sex = "女";
        // else user.userInfo.sex = "男";
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

    var name = req.body.name;
    var sex = 0;
    if (req.body.sex == "男")
        sex = 0;
    else if (req.body.sex == "女")
        sex = 1;

    //var sex = req.body.sex;
    var birth = req.body.birth;
    var school = req.body.school;
    var gread = req.body.gread;
    var phone = req.body.phone;
    var city = req.body.city;
    var province = req.body.province;
    var age = req.body.age;
    var address = req.body.address;

    User.updateUserInfo(user_id, name, sex, age, birth, address, province, city, school, gread, phone, function (err, data) {
        if (err) {
            res.send(false);
        }
        else {
            res.send(true);
        }
    })


}

exports.getUserName = function (req, res, next) {

    if (req.session.user == undefined) {
        res.send("游客");
        return;
    }
    var user_id = req.session.user._id;
    if (user_id == undefined) {
        res.send("游客");
        return;
    }
    User.getUserById(user_id, function (err, doc) {
        if (err) {
            res.send("游客");
        }
        else {
            res.send(doc.name);
        }
    })
}
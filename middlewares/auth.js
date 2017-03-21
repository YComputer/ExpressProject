/**
 * Created by hr on 2016/11/28.
 */
//var mongoose   = require('mongoose');
//var UserModel  = require('../model/User');
//var Message    = require('../proxy').Message;
var config     = require('../config');
//var eventproxy = require('eventproxy');
var UserProxy  = require('../proxy/user');

exports.gen_session =  function gen_session(user, res) {
    var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 1,
        signed: true,
        httpOnly: true,
        _id:user._id,
        name:user.name
    };
    res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {

    if (!req.session || !req.session.user || !req.session.user._id) {
        return res.status(403).send('forbidden!');
    }

    next();
};
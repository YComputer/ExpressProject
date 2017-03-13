/**
 * Created by hr on 2016/11/24.
 */
var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config');
var User           = require('../proxy/user');
//var mail           = require('../common/mail');
var tools          = require('../common/tools');
//var utility        = require('utility');
var authMiddleWare = require('../middlewares/auth');
var uuid           = require('uuid');

/**
 * 显示注册页面
 * @param req
 * @param res
 */
exports.showSignup = function (req, res) {
    res.render('sign/signup');
};

/**
 * 注册
 * @param req
 * @param res
 * @param next
 */
exports.signup = function (req, res, next) {
    var loginname = validator.trim(req.body.loginname).toLowerCase();
    var email     = validator.trim(req.body.email).toLowerCase();
    var pass      = validator.trim(req.body.pass);
    var rePass    = validator.trim(req.body.re_pass);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        res.status(422);
        res.render('sign/signup', {error: msg, loginname: loginname, email: email});
    });

    // 验证信息的正确性
    if ([loginname, pass, rePass, email].some(function (item) { return item === ''; })) {
        ep.emit('prop_err', '信息不完整。');
        return;
    }
    if (loginname.length < 5) {
        ep.emit('prop_err', '用户名至少需要5个字符。');
        return;
    }
    if (!tools.validateId(loginname)) {
        return ep.emit('prop_err', '用户名不合法。');
    }
    if (!validator.isEmail(email)) {
        return ep.emit('prop_err', '邮箱不合法。');
    }
    if (pass !== rePass) {
        return ep.emit('prop_err', '两次密码输入不一致。');
    }
    // END 验证信息的正确性

    User.getUsersByQuery({'$or': [
        {'loginname': loginname},
        {'email': email}
    ]}, {}, function (err, users) {
        if (err) {
            return next(err);
        }
        if (users.length > 0) {
            ep.emit('prop_err', '用户名或邮箱已被使用。');
            return;
        }
        tools.bhash(pass, ep.done(function (passhash) {
            // create gravatar
            var avatarUrl = User.makeGravatar(email);
            User.newAndSave(loginname, loginname, passhash, email, avatarUrl, false, function (err) {
                if (err) {
                    return next(err);
                }
                // 发送激活邮件
                //mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
                res.render('sign/signup', {
                    success: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
                });
            });

        }));
    });
}

/**
 * 显示登录页面
 * @param req
 * @param res
 */
exports.showLogin = function (req, res) {
    //req.session._loginReferer = req.headers.referer;
    res.render('sign/signin');
};

var notJump = [
    '/active_account', //active page
    '/reset_pass',     //reset password page, avoid to reset twice
    '/signup',         //regist page
    '/search_pass'    //serch pass page
];

/**
 * 登录
 * @param req
 * @param res
 * @param next
 */
exports.login = function (req, res, next) {
    var loginname = validator.trim(req.body.name).toLowerCase();
    var pass      = validator.trim(req.body.pass);

    var ep        = new eventproxy();
    ep.fail(next);

    if (!loginname || !pass) {
        res.status(422);
        return res.render('sign/signin', { error: '信息不完整。' });
    }

    var getUser;
    if (loginname.indexOf('@') !== -1) {
        getUser = User.getUserByMail;
    } else {
        getUser = User.getUserByLoginName;
    }

    ep.on('login_error', function (login_error) {
        res.status(403);
        res.render('sign/signin', { error: '用户名或密码错误' });
    });

    getUser(loginname, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return ep.emit('login_error');
        }
        var passhash = user.pass;
        tools.bcompare(pass, passhash, ep.done(function (bool) {
            if (!bool) {
                return ep.emit('login_error');
            }
            // if (!user.active) {
            //     // 重新发送激活邮件
            //     mail.sendActiveMail(user.email, utility.md5(user.email + passhash + config.session_secret), user.loginname);
            //     res.status(403);
            //     return res.render('sign/signin', { error: '此帐号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。' });
            // }

            // store session cookie
            authMiddleWare.gen_session(user, res);
            //check at some page just jump to home page
            var refer = req.session._loginReferer || '/test';
            for (var i = 0, len = notJump.length; i !== len; ++i) {
                if (refer.indexOf(notJump[i]) >= 0) {
                    refer = '/';
                    break;
                }
            }
            req.session.user = user
            res.redirect(refer);
        }));
    });

}

/**
 * 登出
 * @param req
 * @param res
 * @param next
 */
exports.signout = function (req, res, next) {}

/**
 * 激活账户
 * @param req
 * @param res
 * @param next
 */
exports.activeAccount = function (req, res, next) {}
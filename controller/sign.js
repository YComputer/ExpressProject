/**
 * Created by hr on 2016/11/24.
 */
var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy/user');
//var mail           = require('../common/mail');
var tools = require('../common/tools');
//var utility        = require('utility');
var authMiddleWare = require('../middlewares/auth');
var uuid = require('uuid');

var mail = require('../common/mail');
var svgCaptcha = require("svg-captcha");

exports.checkLoginStatus = function (req, res) {
    if (!req.session || !req.session.user || !req.session.user._id) {
        return res.send(false);
    }
    else {
        return res.send(true);
    }
}

/**
 * 显示注册页面
 * @param req
 * @param res
 */
exports.newsignup = function (req, res) {
    res.render('sign/newSignup');
}

/**
 * 显示登录页面
 * @param req
 * @param res
 */
exports.newsignin = function (req, res) {
    res.render('sign/newSignin');
}

/**
 * 注册
 * @param req
 * @param res
 * @param next
 */
exports.signup = function (req, res, next) {
    var loginname = req.body.loginname;
    var email = req.body.email;
    var pass = req.body.pass;
    var rePass = req.body.re_pass;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function (msg) {
        //res.status(422);
        res.send({ error: msg });
        //res.render('sign/newsignup', { error: msg, loginname: loginname, email: email });
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

    User.getUsersByQuery({
        '$or': [
            { 'loginname': loginname },
            { 'email': email }
        ]
    }, {}, function (err, users) {
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

                //发送激活邮件
                var expiredtime = Date.now().toString();
                href = config.config.host + 'activeAccount?' + 'email=' + email + '&expiredtime=' + expiredtime;
                mail.sendActiveMail(email, href);

                // res.render('sign/signup', {
                //     success: '欢迎加入 ' + loginname + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
                // });
                res.send({ message: "successed" });
                //res.redirect('index');
            });

        }));
    });
}



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
    var loginname = req.body.loginname;
    var pass = req.body.pass;

    var ep = new eventproxy();
    ep.fail(next);

    if (!loginname || !pass) {
        res.status(422);
        return res.send({ error: '请填写用户名和密码' });
    }

    var getUser;
    if (loginname.indexOf('@') !== -1) {
        getUser = User.getUserByMail;
    } else {
        getUser = User.getUserByLoginName;
    }

    ep.on('login_error', function (login_error) {
        res.status(403);
        res.render('sign/newSignin', { error: '用户名或密码错误' });
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
            if (!user.active) {
                // 重新发送激活邮件
                var expiredtime = Date.now().toString();
                href = config.config.host + 'activeAccount?' + 'email=' + email + '&expiredtime=' + expiredtime;
                mail.sendResetPwdMail(email, href);
                res.status(403);
                return res.render('sign/signin', { error: '此帐号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。' });
            }

            // store session cookie
            authMiddleWare.gen_session(user, res);
            //check at some page just jump to home page
            // var refer = req.session._loginReferer || '/test';
            // for (var i = 0, len = notJump.length; i !== len; ++i) {
            //     if (refer.indexOf(notJump[i]) >= 0) {
            //         refer = '/';
            //         break;
            //     }
            // }
            req.session.user = user
            res.send({ message: "successed" });
        }));
    });

}

/**
 * 登出
 * @param req
 * @param res
 * @param next
 */
exports.signout = function (req, res, next) {

    if (req.session.user == undefined) {
        res.render('sign/newSignin');
        return;
    }
    var user_id = req.session.user._id;
    if (user_id == undefined) {
        res.render('sign/newSignin');
        return;
    }

    req.session.user = undefined;
    res.render('sign/newSignin');

}

/**
 * 激活账户
 * @param req
 * @param res
 * @param next
 */
exports.activeAccount = function (req, res, next) {


    var email = req.query.email;
    var expiredtime = req.query.expiredtime;

    //判断链接有效性
    var validTime = 2 * 60 * 60 * 1000;
    if (Date.now().toString() < expiredtime || Date.now().toString() - expiredtime > validTime) {
        res.send({ error: '当前链接已失效' });
        return;
    }

    //激活用户
    User.activeAccount(email, function (err, doc) {
        if (err) {
            ep.emit("prop_err", '用户激活失败');
        } else {
            //TODO-提示用户
            res.render('sign/newSignin');
        }
    });

}

/**
 * 找回密码
 * @param req
 * @param res
 */
exports.findpwd = function (req, res) {
    res.render('sign/findpwd');
}

/**
 * 发送邮件-找回密码链接
 * @param req
 * @param res
 */
exports.sendResetPwdMail = function (req, res) {

    var email = req.body.email;
    var verifycode = req.body.verifycode;
    var href;

    //检查验证码
    if (verifycode != req.session["randomcode"]) {
        res.send({ error: '验证码错误' });
        return;
    }

    User.getUserByMail(email, function (err, doc) {
        if (err) {
            res.send({ error: '该邮箱不存在' });

        } else {
            if (doc.length < 1) {
                res.send({ error: '该邮箱不存在' });
                return;
            }
            var userid = doc.id;
            var key = doc.accessToken;
            var expiredtime = Date.now().toString();
            href = config.config.host + 'resetpwd?' + 'userid=' + userid + '&key=' + key + '&expiredtime=' + expiredtime;
            mail.sendResetPwdMail(email, href);
            res.send({
                data: 'success'
            });
        }
    })


}

/**
 * 重置密码页面
 * @param req
 * @param res
 */
exports.page_reset_pwd = function (req, res) {

    var userid = req.query.userid;
    var key = req.query.key;
    var expiredtime = req.query.expiredtime;

    //判断链接有效性
    var validTime = 2 * 60 * 60 * 1000;
    if (Date.now().toString() < expiredtime || Date.now().toString() - expiredtime > validTime) {
        res.send({ error: '当前链接已失效' });
        return;
    }

    res.render('sign/resetpwd', { userid: userid, key: key });
}

/**
 * 重置密码
 * @param req
 * @param res
 */
exports.reset_pwd = function (req, res) {

    var userid = req.body.userid;
    // var email = req.body.email;
    var pass = req.body.pass;
    // var rePass = req.body.re_pass;

    var ep = new eventproxy();
    ep.fail(function () {
        res.send({ error: '重置密码失败' });
    });

    ep.on('prop_err', function (msg) {
        //res.status(422);
        res.send({ error: msg });
        //res.render('sign/newsignup', { error: msg, loginname: loginname, email: email });
    });

    // // 验证信息的正确性
    // if ([userid, pass].some(function (item) { return item === ''; })) {
    //     ep.emit('prop_err', '信息不完整。');
    //     return;
    // }

    //密码加密
    tools.bhash(pass, function (err, passhash) {
        if (err) {
            ep.emit("prop_err", '重置密码失败');
        } else {
            //重置密码-保存新密码
            User.resetpwd(userid, passhash, function (err, doc) {
                if (err) {
                    ep.emit("prop_err", '重置密码失败');
                } else {
                    res.send({
                        data: doc
                    });
                }
            });
        };


    });


};

/**
 *  验证码
 */
exports.genVerifycode = function (req, res) {

    // 验证码，对了有两个属性，text是字符，data是svg代码  
    var code = svgCaptcha.create({
        // 翻转颜色  
        inverse: false,
        // 字体大小  
        fontSize: 36,
        // 噪声线条数  
        noise: 3,
        // 宽度  
        width: 80,
        // 高度  
        height: 40,
    });
    // 保存到session,忽略大小写  
    req.session["randomcode"] = code.text.toLowerCase();
    // 返回数据直接放入页面元素展示即可  
    res.send(code.data);
}; 

/**
 * Created by hr on 2016/11/29.
 */
var logger = require('../common/logger');
var config     = require('../config');
var url = require("url");

exports.index = function(req,res,next){
    //var auth_token = "adsf" + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    // var opts = {
    //     path: '/',
    //     maxAge: 1000 * 60 * 60 * 24 * 1,
    //     signed: true,
    //     httpOnly: true
    // };
    //res.cookie("_loginReferer", "/test/", opts); //cookie 有效期30天
    res.render('index', { title: 'Express' });
}
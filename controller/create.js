/**
 * Created by hr on 2016/11/29.
 */
var logger = require('../common/logger');
var config     = require('../config');
var url = require("url");

exports.showEditor = function(req, res, next){
    res.render('create', { title: 'Create', Url : config.config.host });
}
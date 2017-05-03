var logger = require('../common/logger');
var config     = require('../config');
var url = require("url");

exports.aboutus = function (req,res,next) {
    res.render("statics/aboutus");
}
exports.contactus = function (req,res,next) {
    res.render("statics/contactus");
}
exports.joinus = function (req,res,next) {
    res.render("statics/joinus");
}
exports.news = function (req,res,next) {
    res.render("statics/news");
}
exports.partner = function (req,res,next) {
    res.render("statics/partner");
}
exports.serviceprotocol = function (req,res,next) {
    res.render("statics/serviceprotocol");
}
exports.otherproduct = function (req,res,next) {
    res.render("statics/otherproduct");
}

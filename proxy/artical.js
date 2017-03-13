var Artical    = require('../model/artical').userModel;
var utility = require('utility');
var uuid    = require('uuid');

exports.getall = function(callback){
    Artical.find({},callback);
}
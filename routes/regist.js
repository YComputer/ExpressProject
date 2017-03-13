/**
 * Created by hr on 2016/9/6.
 */

var express = require('express');
var http = require("http");
var url = require("url");
var router = express.Router();
var mongoDB = require("../DBService/DataBaseConnection/mongoDB.js");

//用户注册
router.get('/', function(req, res,next){
    var username =url.parse(req.url,true).query.username;
    var password =url.parse(req.url,true).query.password;
    if(username==undefined){
        res.render('regist');
    }
    var document = {"username":username,"password":password};

    mongoDB.findDocument("users",{username:username},(err, data)=>{
        if(data.length!=0){
            res.send("用户名已存在。");
        }
        else{
            mongoDB.insertDocument("users",document,(err, data)=>{
                if(err){
                    res.send(err);
                }
                else{
                    res.send(data);
                }
            });
        }
    });
});

//用户注册,暂时不用
router.post('/', function(req, res,next){
    var username =req.body.username;
    var password =req.body.password;
    var password_repeat = req.body.password_repeat;
    var document = {"username":username,"password":password};
    mongoDB.insertDocument("users",document,(data)=>{
        if(data!=err){
            res.send("注册成功。")
        }
        else{
            res.send("注册失败。")
        }
    });
});

module.exports = router;
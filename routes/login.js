/**
 * Created by hr on 2016/9/8.
 */

var express = require('express');
var mongoDB = require("../DBService/DataBaseConnection/mongoDB.js");
var http = require("http");
var url = require("url");
var router = express.Router();

//用户登录
router.get('/', function(req, res,next){
    var username =url.parse(req.url,true).query.username;
    var password =url.parse(req.url,true).query.password;
    if(username==undefined){
        res.render('login');
    }
    mongoDB.findDocument("users",{username:username},(err,data)=>{
        if(err){
            res.send('登录失败');
        }
        else{
            if(data.length==0){
                res.send("用户名不存在");
            }
            else if(data.length>0 && data[0].password!=password){
                res.send("密码错误");
            }else{
                res.send('登录成功');
            }
        }
    })
});

module.exports = router;

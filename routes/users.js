var express = require('express');
var router = express.Router();

var http = require("http");
var url = require("url");
var mongoDB = require("../DBService/DataBaseConnection/mongoDB.js");
ObjectId = require('mongodb').ObjectID;
/* GET users listing. */
router.get('/countinfo', function(req, res) {
  var userId =url.parse(req.url,true).query.userId;
  if(userId=undefined){
    res.send("用户id错误");
    return;
  }
  else{
    mongoDB.findDocument("users",{_id:ObjectId("57e00744ce88370c883066c6")},function(err, data){
      if(err || data.length==0){
        res.send("获取用户信息失败")
      }
      else{
        res.render('countinfo',data[0]);
      }
    })
  }
});

router.get('/detailinfo', function(req, res) {
  var userId =url.parse(req.url,true).query.userId;
  if(userId=undefined){
    res.send("用户id错误");
    return;
  }
  else{
    mongoDB.findDocument("users",{_id:ObjectId("57e00744ce88370c883066c6")},function(err, data){
      if(err || data.length==0){
        res.send("获取用户信息失败")
      }
      else{
        res.render('detailinfo',data[0]);
      }
    })
  }
});

router.get('/historyinfo', function(req, res) {
  var userId =url.parse(req.url,true).query.userId;
  if(userId=undefined){
    res.send("用户id错误");
    return;
  }else{
    mongoDB.findDocument("history",{user_id:ObjectId("57e00744ce88370c883066c6")},function(err, data){
      if(err){
        res.send("获取用户信息失败")
      }
      else{
        res.render('historyinfo',{
          list:data
        });
      }
    })
  }
  //res.render('historyinfo');
  //mongoDB.updateDocument("user",{username:"lijie"},{username:"lijie",password:"lijie1108"},(data)=>{
  //  res.send(data);
  //})
});

module.exports = router;

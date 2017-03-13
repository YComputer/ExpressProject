/**
 * Created by hr on 2016/9/26.
 */

var express = require('express');
var router = express.Router();
var mongoDB = require("../DBService/DataBaseConnection/mongoDB.js");
var http = require("http");
var url = require("url");

//获取所有教学视频
router.get("/",function(req, res){
    mongoDB.findDocument("studyvideos",{},(err,data)=>{
        if(err){
            res.send("获取教学视频失败。");
        }
        else{
            res.render("studyvideos",{
                list:data
            });
            //res.send(data);
        }
    })
})

router.get("/getallcourse",function(req, res){
    //res.render(course)
    mongoDB.findDocument("studyvideos",{},(data)=>{
        if(data){
            res.send("获取教学视频失败。");
        }
        else{
            res.send(data);
        }
    })
})

module.exports = router;
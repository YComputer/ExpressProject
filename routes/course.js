/**
 * Created by hr on 2016/10/7.
 */
var express = require('express');
var router = express.Router();
var mongoDB = require("../DBService/DataBaseConnection/mongoDB.js");
var http = require("http");
var url = require("url");

//获取所有课程
router.get("/",function(req, res){
    mongoDB.findDocument("course",{},(err,data)=>{
        if(err){
            res.send("获取所有课程失败。");
        }
        else{
            res.render("course",{
                list:data
            });
            //res.send(data);
        }
    })
})

module.exports = router;
/**
 * Created by hr on 2016/11/3.
 */
var express = require('express');
var router = express.Router();
var mongoose=require("mongoose");

var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'res0' }
};

mongoose.connect('mongodb://192.168.91.130:27017,192.168.91.133:27017,192.168.91.134:27017/rs_test',options)
var db = mongoose.connection;
db.on('error',function(){
    console.log("mongoose连接副本集失败！")
});
db.on('open',function(){
    console.log("mongoose连接副本集成功！")
});
var userSchema = mongoose.Schema({
    username:String,
    email:String,
    first_name:String,
    last_name:String
},{versionKey:false});

var userModel = mongoose.model("hello",userSchema);

router.get('/', function(req, res) {
    var lijie = new userModel();
    lijie.username="lijie";
    lijie.email="lijie1108@126.com";
    lijie.first_name="li";
    lijie.last_name="jie";
    userModel.create(lijie,function (err,data) {
        if(err) res.send(err);
        else{
            res.send(data);
        }
    })
});

module.exports = router;
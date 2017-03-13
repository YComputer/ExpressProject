/**
 * Created by hr on 2016/12/19.
 */
var Work = require('../proxy/work');
var artical = require('../proxy/artical');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");

exports.listAll = function(req, res, next){

    Work.getAllWork(function(err, docs){
        if(err){
            logger.error(err);
            res.send(err);
            return next(err);
        }
        else{
            res.render("composition/works",{
                list:docs
            });
        }
    });
    //
    // var data=[{
    //     name:"小猫借钱",
    //     data:'/swf/喵咪收钱.sb2.swf',
    //     project:"F:\\培训\\scratch项目\\接苹果.sb2"
    // },
    //     {
    //         name:"瞎猫",
    //         data:"/swf/喵咪收钱.sb2.swf",
    //         project:"F:\\培训\\scratch项目\\接苹果.sb2"
    //     }];

}

exports.getallartical = function(req,res,next){
    artical.getall(function(docs){
        res.send(docs);
        res.render("/composition/works",{hello:docs[0].title});
    })
}

exports.upload = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err, fields, files){
        var name = files.file.name;

        var sourceFile = files.file.path;
        var destPath = path.join("F:\\ExpressProject\\public\\avatar\\",name);
        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);

        logger.info("收到文件："+files);
        res.end();
    });
}
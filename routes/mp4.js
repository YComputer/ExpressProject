/**
 * Created by nodefx on 8/28/14.
 */

var express = require('express');
var router = express.Router();
var dbservice = require('../DBService/DataBaseConnection/DBConnection.js');
var orm = require("../DBService/DataBaseConnection/orm.js");
var http = require('http')
var fs = require('fs')
var query = require('../DBService/Service/query.js')

router.get('/', function(req, res,next) {

    try{
        //orm.query(res);
        query.query();
        //dbservice.query(res);
    }
    catch(err){
        console.log(err);
    }




    //res.render('video', { video: '/video/1464190314146.mp4' });
    //next();
});

router.use(function(request, response){
    var mp4 = './public/video/1464190314146.mp4';
    var stat = fs.statSync(mp4);
    response.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.size
    })

    var readableStream = fs.createReadStream(mp4);
    readableStream.pipe(response);
});

module.exports = router;

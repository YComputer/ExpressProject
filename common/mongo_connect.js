/**
 * Created by hr on 2016/11/23.
 */
var mongoose  = require('mongoose');
var config = require('../config').config;
var logger = require('./logger');
var db = mongoose.createConnection(config.mongo_db, {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        logger.error('connect to %s error: ', config.mongo_db, err.message);
        process.exit(1);
    }
});

// db.on("close",function(err,db){
//     if(err){
//         console.log(err);
//         console.log("mongoose关闭失败。")
//     }
//     else{
//         console.log("mongoose关闭成功。")
//     }
// });

exports.mongoose = mongoose;
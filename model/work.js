/**
 * Created by hr on 2016/12/20.
 */
var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config').config;
mongoose.connect(config.mongo_db, {
    server: { poolSize: 20 }
}, function (err) {
    if (err) {
        logger.error('connect to %s error: ', config.mongo_db, err.message);
        process.exit(1);
    }
});
// db.once(function(){
//     logger.error('connect to %s successed.', config.mongo_db);
// });
// db.on("error",function(){
//     logger.error('connect to %s error.', config.mongo_db);
//     process.exit(1);
// });
// db.onClose(function(){
//     logger.error('connect to %s close.', config.mongo_db);
//     process.exit(1);
// });


// mongoose.createConnection(config.mongo_db, {
//     server: {poolSize: 20}
// }, function (err) {
//     if (err) {
//         logger.error('connect to %s error: ', config.mongo_db, err.message);
//         process.exit(1);
//     }
// });


var WorkSchema = new Schema({
    name: { type: String },
    sourcePath: { type: String },
    description: { type: String },
    author: { type: ObjectId },
    uploadTime: { type: Date, default: Date.now },
    upCount: { type: Number, default: 0 }
});

//UserSchema.plugin(BaseModel);
// UserSchema.virtual('avatar_url').get(function () {
//     var url = this.avatar || ('https://gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48');
//
//     // www.gravatar.com 被墙
//     url = url.replace('www.gravatar.com', 'gravatar.com');
//
//     // 让协议自适应 protocol，使用 `//` 开头
//     if (url.indexOf('http:') === 0) {
//         url = url.slice(5);
//     }
//
//     // 如果是 github 的头像，则限制大小
//     if (url.indexOf('githubusercontent') !== -1) {
//         url += '&s=120';
//     }
//
//     return url;
// });
//
// UserSchema.virtual('isAdvanced').get(function () {
//     // 积分高于 700 则认为是高级用户
//     return this.score > 700 || this.is_star;
// });

//UserSchema.index({loginname: 1}, {unique: true});
//UserSchema.index({email: 1}, {unique: true});
//UserSchema.index({score: -1});
//UserSchema.index({accessToken: 1});

WorkSchema.pre('save', function (next) {
    var now = new Date();
    this.uploadTime = now;
    next();
});

exports.workModel = mongoose.model('Work', WorkSchema);
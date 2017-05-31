/**
 * Created by hr on 2016/11/23.
 */
var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var config = require('../config').config;

var UserInfoSchema = new Schema({
    name: { type: String },
    sex: { type: Number, default: 0 },  //0男孩 1女孩
    age: { type: Number },
    birth: { type: Date },
    Address: { type: String },
    province: { type: String },
    city: { type: String },
    phoneNumber: { type: String },
    school: { type: String },
    gread: { type: String },
})

var UserSchema = new Schema({
    name: { type: String },
    loginname: { type: String },
    pass: { type: String },
    email: { type: String },
    url: { type: String },
    profile_image_url: { type: String },
    location: { type: String },
    signature: { type: String },
    profile: { type: String },
    weibo: { type: String },
    avatar: { type: String },
    is_block: { type: Boolean, default: false },
    UserInfo: { type: UserInfoSchema },

    score: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    is_star: { type: Boolean },
    level: { type: String },
    active: { type: Boolean, default: false },

    receive_reply_mail: { type: Boolean, default: false },
    receive_at_mail: { type: Boolean, default: false },
    from_wp: { type: Boolean },

    retrieve_time: { type: Number },
    retrieve_key: { type: String },

    accessToken: { type: String },
});

UserSchema.index({ loginname: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ score: -1 });
UserSchema.index({ accessToken: 1 });

UserSchema.pre('save', function (next) {
    var now = new Date();
    this.update_at = now;
    next();
});

exports.userModel = mongoose.model('User', UserSchema);

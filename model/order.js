var mongoose = require('mongoose');
var BaseModel = require("./base_model");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config').config;

var OrderInfoSchema = new Schema({
    appid: { type: String },
    bank_type: { type: String },
    cash_fee: { type: String },
    mch_id: { type: String },
    is_subscribe: { type: String },
    openid: { type: String },
    out_trade_no: { type: String },
    nonce_str: { type: String },
    sign: { type: String },
    sign_type: { type: String },
    trade_type: { type: String },
    prepay_id: { type: String },
    time_end: { type: String },
    body: { type: String },
    detail: { type: String },
    device_info: { type: String },
    attach: { type: String },
    fee_type: { type: String },
    total_fee: { type: String },
    spbill_create_ip: { type: String },
    time_start: { type: String },
    time_expire: { type: String },
    trade_type: { type: String },
    prepay_id: { type: String },
    code_url: { type: String },
    transaction_id: { type: String }
})

var OrderSchema = new Schema({
    user_id: { type: ObjectId },
    product_id: { type: ObjectId },
    order_info: { type: OrderInfoSchema },
    order_creat_time: { type: Date, default: Date.now },
    product_type: { type: Number },  //1:单个视频课程;2:系列视频课程;3:直播单课;4:直播系列课;5:vip会员;
    order_state: { type: Number }    //1:创建;2:待支付;3:已支付;4:支付失败;5:支付完成;6:关闭;
});

exports.OrderSchema = OrderSchema;
exports.OrderModel = mongoose.model('Order', OrderSchema);
var OrderModel = require('../model/order').OrderModel;
var utility = require('utility');
var uuid = require('uuid');

exports.createOrder = function (userId, productId, product_type, order_state, callback) {
    var order = new OrderModel();
    order.user_id = userId;
    order.product_id = productId;
    order.product_type = product_type;
    order.order_state = order_state;
    order.save(callback);
}

exports.initOrder = function (id, data, callback) {
    OrderModel.findById(id, function (err, doc) {
        if (err) {
            callback({ err: err });
        }
        else {
            doc.order_info = {};
            doc.order_info.nonce_str = data.nonce_str;
            doc.order_info.device_info = data.device_info;
            doc.order_info.code_url = data.code_url;
            doc.order_info.appid = data.appid;
            doc.order_info.sign = data.sign;
            doc.order_info.trade_type = data.trade_type;
            doc.order_info.mch_id = data.mch_id;
            doc.order_info.prepay_id = data.prepay_id;
            doc.save(callback);
        }
    })

}

exports.payInitFailedInfoFill = function () {

}

exports.payCallBackInfoFill = function (payInfo, callback) {
    var out_trade_no = payInfo.out_trade_no;
    OrderModel.findById(out_trade_no, function (err, doc) {
        if (err) {
            callback({ err: err });
        }
        else {
            if (!doc.order_info) {
                doc.order_info = {};
            }
            doc.order_info.appid = payInfo.appid;
            doc.order_info.bank_type = payInfo.bank_type;
            doc.order_info.cash_fee = payInfo.cash_fee;
            doc.order_info.device_info = payInfo.device_info;
            doc.order_info.fee_type = payInfo.fee_type;
            doc.order_info.is_subscribe = payInfo.is_subscribe;
            doc.order_info.mch_id = payInfo.mch_id;
            doc.order_info.nonce_str = payInfo.nonce_str;
            doc.order_info.sign = payInfo.sign;
            doc.order_info.time_end = payInfo.time_end;
            doc.order_info.total_fee = payInfo.total_fee;
            doc.order_info.trade_type = payInfo.trade_type;
            doc.order_info.transaction_id = payInfo.transaction_id;
            doc.order_info.out_trade_no = payInfo.out_trade_no;
            doc.order_info.openid = payInfo.openid;
            doc.order_state = 3;
            doc.save(callback);
        }
    })

}

exports.payFailedCallBackInfoFill = function (payInfo, callback) {

}
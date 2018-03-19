var Order = require('../proxy/order');
var logger = require('../common/logger');
var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var eventproxy = require('eventproxy');
var httpProxy = require('../common/httpProxy');
var userRight = require('../proxy/userRight');
var webSocket = require('../common/websocket');


/**
 * 微信支付，统一下单调用
 */
exports.initpay = function (req, res, next) {
    var userId;
    if (req.session.user) {
        userId = req.session.user._id;
        userName = req.session.user.name;
    }
    else {
        res.send({ err: "您还没有登录，请先登录。" });
        return;
    }

    var courseId = req.query.courseid;
    var fee = req.query.fee;
    var userIp = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
    var userAgent = req.headers['user-agent'];

    Order.createOrder(userId, courseId, 1, 1, function (err, doc) {
        if (err) {
            logger.error(err);
            res.send({ err: err });
        }
        else {
            var url = "http://127.0.0.1:8080/payrequest?userid=" + userId + "&productid=" + courseId + "&out_trade_no=" + doc._id + "&fee=" + fee;
            httpProxy.http_get(url, function (returnData) {
                var data = JSON.parse(returnData);
                if (data.return_code == "SUCCESS") {
                    Order.initOrder(doc._id, data, function (err, doc) {
                        if (err) {
                            res.send({ err: err });
                        }
                        else {
                            res.send({ data: data.code_url });
                        }
                    })
                }
                else {
                    Order.payInitFailedInfoFill();
                }
            });
        }
    });

}

exports.payedCallback = function (req, res, next) {
    var body = req.body || req.rawBody;
    console.info(body);
    var payInfo = body.xml;
    var out_trade_no;
    var xml = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
    var failedXml = '<xml><return_code><![CDATA[FAILED]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
    if (payInfo.return_code == 'SUCCESS') {
        logger.info('用户成功支付金额：', payInfo.cash_fee);
        logger.info('用户openid：', payInfo.openid);

        out_trade_no = payInfo.out_trade_no;
        Order.payCallBackInfoFill(payInfo, function (err, doc) {
            if (err) {
                logger.error(err);
                res && res.send(failedXml);
            }
            else {
                userRight.addRight(doc.user_id, 1, doc.product_id, function (err, doc) {
                    if (err) {
                        logger.error(err);
                        res && res.send(failedXml);
                    }
                    else {
                        webSocket.pushData(doc.userId, "paiedResult", { result: true });
                        res && res.send(xml);
                    }
                })
            }
        })
    } else {
        logger.info('用户支付失败：', payInfo.return_msg);
        logger.info('用户openid：', payInfo.openid);
        Order.payFailedCallBackInfoFill(payInfo, function (err, doc) {
            if (err) {
                logger.error(err);
            }
            else {
                logger.info("用户支付失败，更新订单信息失败");
            }
            webSocket.pushData(doc.user_id, "paiedResult", { result: false });
            res && res.send(failedXml);
        })
    }
    // var xml = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
    // res && res.send(xml);
}
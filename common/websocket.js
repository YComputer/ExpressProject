var logger = require('../common/logger');
var redis = require('../common/redis');
var cookieParseJson = require('../common/cookieParseJson');
var socketMap = new Map();
exports.socketOnConnection = function (socket) {
    var key = getSessionIdFromSocket(socket);
    redis.get(key, function (err, doc) {
        var user = JSON.parse(doc);
        logger.info(user);
        socketMap.set(user.user._id, socket);
    })

    //socketMap.set(1, socket);
    //socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        logger.log(data);
    });
    socket.on('disconnect', function (reason) {

        redis.get(key, function (err, doc) {
            if (err) {
                logger.err("socketio 断开链接,删除socket缓存失败", err);
            }
            else {
                var user = JSON.parse(doc);
                logger.info(user);
                socketMap.delete(user.user._id);
                logger.info("socketio 断开链接", reason);
            }
        })
    });
}

exports.pushData = function (userId, eventName, data) {
    var socket = socketMap.get(userId.toString());
    if (socket) {
        socket.emit(eventName, data);
    }
}

var getSessionIdFromSocket = function (socket) {
    logger.info(socket);
    var cookie = socket.handshake.headers.cookie;
    var connect_sid = cookieParseJson.parse(cookie).get('connect.sid');
    logger.info(cookie);
    logger.info(connect_sid);
    var key = "sess:" + connect_sid.substring(4, connect_sid.indexOf('.'));
    return key;
}

exports.socketMap = socketMap;

/**
 * Created by hr on 2016/11/28.
 */
var config = require('../config');
var Redis = require('ioredis');
var logger = require('./logger')

var client = new Redis({
    port: config.config.redis_config.redis_port,
    host: config.config.redis_config.redis_host,
    db: config.config.redis_config.redis_db,
    password: config.config.redis_config.redis_password
});

client.on('error', function (err) {
    if (err) {
        logger.error('connect to redis error, check your redis config', err);
        process.exit(1);
    }
})

exports = module.exports = client;

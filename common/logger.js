/**
 * Created by hr on 2016/11/23.
 */
var config = require('../config');

var env = process.env.NODE_ENV || "development"
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: '/logs/cheese.log', category: 'scratch' }
    ]
});

var logger = log4js.getLogger('scratch');
//logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'ERROR')
logger.setLevel("INFO");
module.exports = logger;
/**
 * Created by hr on 2016/11/23.
 */
var config = require('../config');

var env = process.env.NODE_ENV || "development"
var log4js = require('log4js');
log4js.configure({

    appenders: {
        out: { type: 'console' },
        task: { type: 'dateFile', filename: 'logs/task', "pattern": "-dd.log", alwaysIncludePattern: true },
        result: { type: 'dateFile', filename: 'logs/result', "pattern": "-dd.log", alwaysIncludePattern: true },
        error: { type: 'dateFile', filename: 'logs/error', "pattern": "-dd.log", alwaysIncludePattern: true },
        default: { type: 'dateFile', filename: 'logs/default', "pattern": "-dd.log", alwaysIncludePattern: true },
        rate: { type: 'dateFile', filename: 'logs/rate', "pattern": "-dd.log", alwaysIncludePattern: true }
    },
    categories: {
        default: { appenders: ['out', 'default'], level: 'info' },
        task: { appenders: ['task'], level: 'info' },
        result: { appenders: ['result'], level: 'info' },
        error: { appenders: ['error'], level: 'error' },
        rate: { appenders: ['rate'], level: 'info' }
    }

    // appenders: [
    //     { type: 'console' },
    //     { type: 'file', filename: '/logs/cheese.log', category: 'scratch' }
    // ]
});

var logger = log4js.getLogger('scratch');
//logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'ERROR')
//logger.setLevel("INFO");
module.exports = logger;
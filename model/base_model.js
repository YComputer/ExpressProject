/**
 * Created by hr on 2016/11/23.
 */
var tools = require('../common/tools');
var mongoose = require('mongoose');
var config = require('../config').config;
mongoose.connect(config.mongo_db, {
    server: { poolSize: 20 }
}, function (err) {
    if (err) {
        logger.error('connect to %s error: ', config.mongo_db, err.message);
        process.exit(1);
    }
});

module.exports = function (schema) {
    schema.methods.create_at_ago = function () {
        return tools.formatDate(this.create_at, true);
    };

    schema.methods.update_at_ago = function () {
        return tools.formatDate(this.update_at, true);
    };
};
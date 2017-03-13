var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require("./config").config;
var session = require('express-session');
var RedisStore = require('connect-redis')(session);


//var winston = require('winston');
//var loggerss = new winston.Logger();
//loggerss.log("info","系统启动。")

//var routes = require('./routes/index');
//var users = require('./routes/users');
//var download = require('./routes/download');
//var onlineCount=require('./routes/onlineCount');
//var upload=require('./routes/upload');
//var video=require('./routes/videostream');
//var mp4=require('./routes/mp4');
//var regist=require('./routes/regist');
//var login=require('./routes/login');
//var studyvideos = require('./routes/studyvideos');
//var course = require('./routes/course');
//var mongoose = require('./routes/mongooseTest');
var webRouter = require('./routes/web_router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('view engine', 'html');
//app.engine('html', require('ejs-mate'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')(config.session_secret));
//app.use(require('express-session'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: config.session_secret,
    store: new RedisStore({ host: 'localhost', port: 6379}),
    resave: false,
    //saveUninitialized: true,
}));


// app.use('/', routes);
// app.use('/users', users);
// app.use('/download',download);
// app.use('/onlinecount',onlineCount);
// app.use('/upload',upload);
// app.use('/video',video);
// app.use('/mp4',mp4);
// app.use('/regist',regist);
// app.use('/login',login);
// app.use('/studyvideos',studyvideos);
// app.use('/course',course);
//app.use('/mongoose',mongoose);
app.use('/', webRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        console.error(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
    console.error(err);
});

process.on('uncaughtException', function(err){

    console.log('Caught exception: ' + err);
    console.error(err.message);
    //console.error(err.stack());
});


module.exports = app;

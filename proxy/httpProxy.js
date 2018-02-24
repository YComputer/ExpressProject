var http = require('http');
var https = require("https");

exports.get = function (url, callback) {

    var option = {
        url: url,
        method: "GET"
    }

    var req = https.get(url, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var html = '';
        res.on('data', function (data) {
            html += data;
        });
        res.on('end', function () {
            console.info(html);
            callback(html);
        });

    }).on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback(null);
    });
    req.end();

}

exports.post = function (data, callback) {
    var opt = {
        method: "POST",
        host: "127.0.0.1",
        port: 80,
        path: "/demo/test.php?name=xmzzaaaa",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": data.length
        }
    };

    var req = https.request(opt, function (serverFeedback) {
        //console.log(serverFeedback.statusCode);
        serverFeedback.on('data', function (chunk) {
            //response.end('BODY: ' + chunk);
            response.end('response ' + chunk);
            //console.log('response ', chunk);
        }).on('end', function (chunk) {

            console.log('end');
        });
        return;
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
    console.log('ccc' + data);
    req.end();
}
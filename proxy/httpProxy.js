var http = require('http');

exports.get = function (url, callback) {

    http.get(url, function (req, res) {
        var html = '';
        req.on('data', function (data) {
            html += data;
        });
        req.on('end', function () {
            console.info(html);
            callback(html);
        });
    });

}

exports.get = function (data, callback) {
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

    var req = http.request(opt, function (serverFeedback) {
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
exports.parse = function (cookie) {
    var cookieJson = new Map();
    var contents = cookie.split(";");
    for (var i = 0; i < contents.length; i++) {
        var keyvaluepaire = contents[i].split('=');
        cookieJson.set(keyvaluepaire[0], keyvaluepaire[1]);
    }
    return cookieJson;
}
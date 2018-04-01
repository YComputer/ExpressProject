$(function () {
    var url = location.href;
    var currentWorkid = url.substr(url.lastIndexOf('=') + 1);
    var currentWork;
    if (!currentWorkid) {
        alert("无法获取当前作品的id");
    }



    function getWorkInfo(workid) {
        $.ajax({
            type: "get",
            url: "/api/work/getworkinfo?workid=" + currentWorkid,
            success: function (data) {
                if (data.err) {
                    console.error("获取作品信息失败");
                    console.error(data.err);
                }
                else {
                    var currentWork = data.data;

                }
            },
            failed: function (data) {
                console.error("获取作品信息失败");
            }
        })
    }

    function getWorkComments(workid) {

    }


    var uurl = "http://127.0.0.1:5000/";
    if ("https:" == document.location.protocol) {
        uurl = uurl.replace("http", "https");
        uurl = uurl.replace("80", "443");
    }
    P.IO.PROJECT_URL = uurl;
    P.IO.SOUNDBANK_URL = uurl;
    function show(id) {
        //     titleArea.style.height = id ? 0 : titleAreaHeight + 'px';
        //   playerArea.style.height = id ? playerAreaHeight + 'px' : 0

        if (!id) urlInput.focus();
    }

    function load(id) {
        if (id !== 'zip') {
            show(id);
        } else {
            id = '';
        }
        if (currentWork.sourcePath.indexOf('sb2') !== -1) {
            P.player.load(id, function (stage) {
                //stage.triggerGreenFlag();
            }, function (title) {
                document.title = title ? title + ' \xb7 sulfurous' : 'sulfurous';
            });
        } else {
            alert("the file is not sb2")
        }


    }

    load('works/' + currentWork._id + '/downresource');

    $(window).resize(function (e) {
        var Pic = document.getElementsByTagName("canvas")[0];
        $(".controls").css({ 'width': (Pic.width + 'px') });
    });

    if ("https:" == document.location.protocol) {
        uurl = uurl.replace("http", "https");
        uurl = uurl.replace("80", "443");
    }
    new QRCode(document.getElementById("qrcode"), "" + uurl + "mobile/works/#{work._id}");
    $("#buttshare").on('click', function () {
        $("#qrcode").css({ 'display': "block" });
        $("#hiddenqrcode").css({ 'display': "inline" });
        $("#buttshare").css({ 'display': "none" });
        $.scrollTo('+350px', 500);
    })
    $("#hiddenqrcode").on('click', function () {
        $("#qrcode").css({ 'display': "none" });
        $("#buttshare").css({ 'display': "inline" });
        $("#hiddenqrcode").css({ 'display': "none" });
        $.scrollTo('-350px', 500);
    })

})
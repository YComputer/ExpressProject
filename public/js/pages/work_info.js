$(function () {
    var url = location.href;
    var currentWorkid = url.substr(url.lastIndexOf('=') + 1);
    var currentWork;
    var workComments
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
                    currentWork = data.data;
                    load('works/' + currentWorkid + '/downresource');
                    console.info(currentWork);
                    fillWorkInfo(currentWork);

                }
            },
            failed: function (data) {
                console.error("获取作品信息失败");
            }
        })
    }

    function fillWorkInfo(work) {
        $('#thumbsUpCount')[0].innerHTML = work.upCount;
        $('#thumbsUpNames')[0].innerHTML = work.thumbsUp;
        $('#downloadsource')[0].href = "/works/" + work._id + "/downresource";
        $('#editWork')[0].href = "/remix/" + work._id;
        $('#fullScreen')[0].href = "/works/" + work._id + "/full";
        $('#viewEvaluation')[0].href = "/works/" + work._id + "/evaluation";

        $('#workname')[0].innerHTML = work.name;
        $('#authorname')[0].innerHTML = work.authorName;
        $('#createtime')[0].innerHTML = work.uploadTime;
        $('#discription')[0].innerHTML = work.description;
    }

    getWorkInfo(currentWorkid);
    function getWorkComments(workid) {
        $.ajax({
            type: "get",
            url: "/api/work/getworkcomments?workid=" + currentWorkid,
            success: function (data) {
                if (data.err) {
                    console.error("获取作品评论信息失败");
                    console.error(data.err);
                }
                else {
                    workComments = data.data;
                    showComments();
                }
            },
            failed: function (data) {
                console.error("获取作品评论信息失败", data);
            }
        })
    }
    getWorkComments(currentWorkid);

    function showComments() {
        for (var i = 0; i < workComments.length; i++) {
            var comment = document.createElement("li");
            //comment.style = "list-style-type:none;";
            comment.className = "list-group-item";
            comment.innerHTML = generateCommentDiv(workComments[i], i);
            $('#workCommentList').append(comment);
        }
    }

    function generateCommentDiv(comment, i) {
        var user;
        if (!comment.commentUser) {
            user = "游客";
        }

        var newcommenthtml = '<div>'
            + '<div class="row">'
            + '<div class="col-md-3">'
            + '<p>作者：'
            + '<a href="/user/' + comment.commentUser + '">' + user + '</a>'
            + '</p>'
            + '</div>'
            + '<div class="col-md-5">'
            + '<p style="display:inline">时间：</p>'
            + '<p style="display:inline">' + comment.commentTime + '</p>'
            + '</div>'
            + '<div class="col-md-1 pull-right">'
            + '<p>' + i + ' 楼</p>'
            + '</div>'
            + '</div>'
            + '<div>'
            + '<p>' + comment.commentContent + '</p>'
            + '</div>'
            + '</div>';
        return newcommenthtml;
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
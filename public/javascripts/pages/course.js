$(function () {
    var url = location.href;
    var currentCourse;
    var courseId;
    var hasRight = true;
    var myPlayer = videojs('example_video_1');
    function getUserRight() {
        $.ajax({
            type: "get",
            url: "/courses/checkRights/" + courseId,
            success: function (data) {
                if (data == "true") {
                    hasRight = true;
                }
                else {
                    hasRight = false;
                }
            },
            failed: function (err) {
                console.error(err);
                hasRight = true;
            }
        });
    }


    var video;
    var scale = 0.8;
    var initialize = function () {
        video = document.getElementById("example_video_1_html5_api");
        video.addEventListener('loadeddata', captureImage);
    };

    var captureImage = function () {
        var canvas = document.createElement("canvas");
        canvas.width = 740;
        canvas.height = 464;
        canvas.getContext('2d').drawImage(video, 0, 0, 740, 464);
        $("#example_video_1_html5_api").attr("poster", canvas.toDataURL("image/png"))
    };

    initialize();



    if (url.indexOf('/') != -1) {
        courseId = url.substr(url.lastIndexOf('/') + 1);
        $.ajax({
            type: 'get',
            url: '/courses/getcourseById?courseid=' + courseId,
            success: function (data) {
                currentCourse = data;
                if (currentCourse.coursePrise != 0) {
                    getUserRight();
                }
                console.info(data);
            },
            failed: function (err) {
                console.error(err);
            }
        });
    }

    $('#submit_comment_btn').on('click', function () {
        var commentContent = $('#course_comment_text')[0].value;
        $.ajax({
            type: "POST",
            url: "/comments",
            data: {
                type: 1,
                id: currentCourseId,
                commentTo: "",
                content: commentContent
            },
            success: postCommentSuccess,
            failed: postCommentFailed
        });
    })

    $('#courseVideoPlayBtn').on('click', function () {
        $('#courseVideo')[0].play();
        $('#courseVideoPlayBtn')[0].style.display = "none";
        $('#playspan')[0].style.display = "none";
        $('#pausespan')[0].style.display = "inline";
    })

    $('#playspan').on('click', function () {
        $('#playspan')[0].style.display = "none";
        $('#courseVideoPlayBtn')[0].style.display = "none";
        $('#pausespan')[0].style.display = "inline";
        $('#courseVideo')[0].play();
    })

    $('#pausespan').on('click', function () {
        $('#playspan')[0].style.display = "inline";
        $('#courseVideoPlayBtn')[0].style.display = "block";
        $('#pausespan')[0].style.display = "none";
        $('#courseVideo')[0].pause();
    })

    $("#courseVideo").on(
        "timeupdate",
        function (event) {
            $('#videotime')[0].innerHTML = "" + this.currentTime + "/" + this.duration;
            var progerss = this.currentTime * 100 / this.duration;
            $('#progress-bar')[0].style.width = '' + progerss + "%";
            //onTrackedVideoFrame(this.currentTime, this.duration);
        });

    var postCommentSuccess = function (data) {
        var ul = $('#courseCommentList')[0];
        ul.appendChild(create_li_item(data))
    }

    var create_li_item = function (data) {
        var fragment = document.createDocumentFragment();
        var li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = '<div>' +
            '<div class="row">' +
            '<div class="col-md-3">' +
            '<p> 作者：' +
            '<a href="user/id">' + data.commentUser + '</a></p>' + '</div>' +
            '<div class="col-md-5">' +
            '<p style="display:inline">时间：' +
            '<p style="display:inline">' + moment(data.commentTime).format('YYYY MMMM Do, hh:mm:ss a') + '</p></p></div>' +
            '<div class="col-md-1" style="position:absolute;right:20px">' +
            '<p> 板凳</p>' +
            '</div></div>' +
            '<div><p>' + data.commentContent + '</p></div>' +
            '</div>';
        fragment.appendChild(li);
        return fragment;
    }

    var postCommentFailed = function () {
        alert("failed")
    }

    videojs("example_video_1").ready(function () {
        var myPlayer = this;
        myPlayer.on('play', function () {
            if (!hasRight) {
                myPlayer.pause();
                $('#myModal').modal('show');
                $.ajax({
                    type: 'get',
                    url: '/courses/wxpay?courseid=' + courseId + '&fee=' + currentCourse.coursePrise,
                    success: function (data) {
                        if (data.err) {
                            console.error(err);
                        }
                        else {
                            $('#paycode').empty();
                            $('#paycode').qrcode({
                                render: 'table',
                                width: 256,
                                height: 256,
                                text: data.data
                            });
                            var socket = io.connect('http://127.0.0.1:5000');
                            socket.on('paiedResult', function (data) {
                                console.log(data);
                                if (data.result == true) {
                                    $('#payreturnmessage')[0].innerHTML = "支付成功";
                                    hasRight = true;
                                    setTimeout(function () {
                                        console.log("支付成功，3秒后关闭支付页面。")
                                        $('#myModal').modal('hide');
                                    }, 3000)
                                }
                                else {
                                    $('#payreturnmessage')[0].innerHTML = "支付失败";
                                }
                                socket.close();
                            });
                        }
                    },
                    failed: function (err) {
                        console.error(err);
                    }
                });
            }
        })
    });
})
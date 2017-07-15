$(function () {
    var userName;
    $.ajax({
        type: "get",
        url: "/getusernamebyid",
        data: {},
        success: function (data) {
            if (data == undefined || data == "") {
                userName = "游客";
            }
            else {
                userName = data;
            }
        },
        failed: function () {
            userName = "游客";
        }
    })

    $('#submit_comment_btn').on('click', function () {
        var commentContent = $('#work_comment_text')[0].value;
        $.ajax({
            type: "POST",
            url: "/comments",
            data: {
                type: 2,
                id: currentWorkId,
                commentTo: "",
                content: commentContent
            },
            success: postCommentSuccess,
            failed: postCommentFailed
        });
    })

    var postCommentSuccess = function (data) {
        var ul = $('#workCommentList')[0];
        var commentSize = $('#workCommentList li').length;
        ul.appendChild(create_li_item(data, commentSize));
        $('#work_comment_text')[0].value = "";
    }

    var create_li_item = function (data, commentSize) {
        var fragment = document.createDocumentFragment();
        var li = document.createElement('li');
        li.className = 'list-group-item';
        var currentFlod;
        switch (commentSize) {
            case 1:
                currentFlod = "沙发";
                break;
            case 2:
                currentFlod = "板凳";
                break;
            default:
                currentFlod = commentSize + 1 + "楼";
        }
        li.innerHTML = '<div>' +
            '<div class="row">' +
            '<div class="col-md-3">' +
            '<p> 作者：' +
            '<a href="user/' + data.commentUser + '">' + userName + '</a></p>' + '</div>' +
            '<div class="col-md-5">' +
            '<p style="display:inline">时间：' +
            '<p style="display:inline">' + moment(data.commentTime).format('YYYY MMMM Do, hh:mm:ss a') + '</p></p></div>' +
            '<div class="col-md-1 pull-right">' +
            '<p>' + currentFlod + '</p>' +
            '</div></div>' +
            '<div><p>' + data.commentContent + '</p></div>' +
            '</div>';
        fragment.appendChild(li);
        return fragment;
    }

    var postCommentFailed = function () {
        alert("发表评论失败")
    }

})
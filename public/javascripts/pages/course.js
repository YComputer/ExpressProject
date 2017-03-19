$(function () {
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
})
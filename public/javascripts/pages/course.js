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
        alert("success")
    }

    var postCommentFailed = function () {
        alert("failed")
    }
})
$(function () {
    $.ajax({
        url: '/checkLoginStatus',
        method: "get",
        type: "application/json",
        success: function (data) {
            if (data.logined) {
                $("#user-info")[0].style.display = "block";
                $("#user-info")[0].style.float = "right";
                $('#user-name')[0].innerHTML = data.user.name;
                $('#user-name')[0].href = "/userhomepage?userid="+data.user._id;
                $("#login-link")[0].style.display = "none";
                $('#user-avatar')[0].src = data.user.avatar;

                // $("#loginBtn_a")[0].style.display = "none";
                // 
                // $("#userbtn_dropdown")[0].style.display = "block";
            }
            else {
                // $("#loginBtn_a")[0].style.display = "block";

                // $("#userbtn_dropdown")[0].style.display = "none";

            }
        },
        error: function (err) {

        }
    })

})
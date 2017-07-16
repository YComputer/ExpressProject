/**
 * Created by hr on 2016/11/30.
 */
$(function () {

    $('#submitsignin').on('click', function () {
        var loginname = $('#loginname')[0].value;
        var pass = $('#pass')[0].value;
        if(!loginname||!pass)
        {
             $('#signininfo')[0].style.visibility = "visible";
             $('#signininfo')[0].innerHTML = "请输入用户名和密码";
             return;
        }
        $.ajax({
            url: '/signin',
            method: "post",
            type: "application/json",
            data: {
                loginname: loginname,
                pass: pass
            },
            success: function (responseText) {
                if (responseText.error) {
                    $('#signininfo')[0].style.visibility = "visible";
                    $('#signininfo')[0].innerHTML = responseText.error;
                }
                else {
                    window.location.href = "/";
                }
            },
            error: function (err) {
                $('#signininfo')[0].style.visibility = "visible";
                $('#signininfo')[0].innerHTML = "登录失败，请重试";

                // alert(JSON.stringify(err));
            }
        });
    });
})
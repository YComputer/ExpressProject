/**
 * Created by yaohw@2017年7月19日20:26:42
 */

function CheckMail(str) {
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

    return reg.test(str);
};

function GenVerifycode() {

    $.ajax({
        url: '/genVerifycode',
        method: "get",
        type: "application/json",

        success: function (responseText) {
            if (responseText.error) {
                alert("验证码刷新错误");
            }
            else {
                var html = responseText;
                $("#verifycodePic")[0].innerHTML = html;
            }
        },
        error: function (err) {
            alert("验证码刷新错误");
        }
    });
};

$(function () {

    $('#findpwd').on('click', function () {
        var email = $('#email')[0].value;
        var verifycode = $('#code-verify')[0].value;
        if (!CheckMail(email)) {
            $('#findpwdinfo')[0].style.visibility = "visible";
            $('#findpwdinfo')[0].innerHTML = "输入的邮箱格式错误";
            return;
        }
        if (!verifycode) {
            $('#findpwdinfo')[0].style.visibility = "visible";
            $('#findpwdinfo')[0].innerHTML = "请输入验证码";
            return;
        }


        $.ajax({
            url: '/sendResetPwdMail',
            method: "post",
            type: "application/json",
            data: {
                email: email,
                verifycode: verifycode,
            },
            success: function (responseText) {
                if (responseText.error) {
                    $('#findpwdinfo')[0].style.visibility = "visible";
                    $('#findpwdinfo')[0].innerHTML = responseText.error;
                    GenVerifycode();
                }
                else {
                    alert("重置密码的链接已发送到您邮箱，请您在48小时之内登录邮箱，点击邮箱内链接设置新密码");
                }
            },
            error: function (err) {
                $('#findpwdinfo')[0].style.visibility = "visible";
                $('#findpwdinfo')[0].innerHTML = "发送失败，请重试";
                GenVerifycode();

            }
        });
    });

    // verifycodePic
    $('#verifycodePic').on('click', GenVerifycode);

    GenVerifycode();

});

function Checkpwd() {

    var password = document.getElementById("password").value;
    var password_repeat = document.getElementById("password-repeat").value;

    if (password != password_repeat) {
        $('#resetpwdinfo')[0].innerHTML = "2次密码输入有误";
        return false;
    }
    else {
        return true;
    }
}

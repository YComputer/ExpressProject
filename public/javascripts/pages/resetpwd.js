/**
 * Created by yaohw@2017年7月21日21:57:01
 */

function CheckMail(str) {
    var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
    return reg.test(str);
};

$(function () {

    $('#resetpwd').on('click', function () {
        if (!Checkpwd()) {
            return;
        }

        var userid = $('#userid')[0].value;
        // var email = $('#email')[0].value;
        var pass = $('#pass')[0].value;
        // var re_pass = $('#re_pass')[0].value;
        $.ajax({
            url: '/resetpwd',
            method: "post",
            type: "application/json",
            data: {
                userid: userid,
                pass: pass,
            },
            success: function (responseText) {
                if (responseText.error) {
                    $('#resetpwdinfo')[0].style.visibility = "visible";
                    $('#resetpwdinfo')[0].innerHTML = responseText.error;
                }
                else {
                    alert(responseText.data);
                    window.location.href = "/newsignin";
                }
            },
            error: function (err) {
                $('#resetpwdinfo')[0].style.visibility = "visible";
                $('#resetpwdinfo')[0].innerHTML = "重置密码失败";

                alert(JSON.stringify(err));
            }
        });
    });

});

function Checkpwd() {

    var password = document.getElementById("pass").value;
    var password_repeat = document.getElementById("re_pass").value;

    if (password.length < 8) {
        $('#resetpwdinfo')[0].style.visibility = "visible";
        $('#resetpwdinfo')[0].innerHTML = "密码长度不足8位";

        return false;
    }

    if (password != password_repeat) {
        $('#resetpwdinfo')[0].style.visibility = "visible";
        $('#resetpwdinfo')[0].innerHTML = "2次密码输入有误";

        return false;
    }
    else {
        return true;
    }
}

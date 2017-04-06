/**
 * Created by hr on 2016/9/20.
 */

$(function () {

    $('#submitsignup').on('click', function () {
        var loginname = $('#loginname')[0].value;
        var email = $('#email')[0].value;
        var pass = $('#pass')[0].value;
        var re_pass = $('#re_pass')[0].value;
        $.ajax({
            url: '/signup',
            method: "post",
            type: "application/json",
            data: {
                loginname: loginname,
                email: email,
                pass: pass,
                re_pass: re_pass
            },
            success: function (responseText) {
                if (responseText.error) {
                    $('#signininfo')[0].style.visibility = "visible";
                    $('#signininfo')[0].innerHTML = responseText.error;
                }
                else {
                    //window.history.back(-1);

                    window.location.href = "/";
                }
            },
            error: function (err) {
                $('#signininfo')[0].style.visibility = "visible";
                $('#signininfo')[0].innerHTML = "注册失败";

                alert(JSON.stringify(err));
            }
        });
    });


    $('#hidden_frame').load(function () {
        var text = $(this).contents().find("body").text();
        // 根据后台返回值处理结果
        var j = $.parseJSON(text);
        if (j.status != 0) {
            alert(j.msg);
        } else {
            alert('导入成功');
            //location.href='BookResourceList.jsp'
        }
    });

    $('#submitregist').on('click', function () {
        //$('#media')[0].play();
        var video = document.getElementById("media");

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var password_repeat = document.getElementById("password-repeat").value;

        if (password.length < 8) {
            $('#passwordhint')[0].style.display = "";
            $('#passwordhint')[0].innerHTML = "密码长度不足8位"
            return false;
        }

        if (password != password_repeat) {
            $('#registHint')[0].innerHTML = "2次密码输入有误";
            $('#registHint')[0].style.display = "";
            return false;
        }
        if (check())
            var queryCondition = "username=" + username + "&password=" + password;

        $.get("/regist", { username: username, password: password },
            function (data) {
                if (data == "用户名已存在。") {
                    $('#usernamehint')[0].innerHTML = "用户名已存在";
                    $('#usernamehint')[0].style.display = "";
                }
                else {
                    $('#registHint')[0].innerHTML = JSON.stringify(data);
                }
            });
        return false;
    })

    $('#username').on('mousedown', function () {
        $('#usernamehint')[0].style.display = "";
    })
    $('#username').on('mouseout', function () {
        $('#usernamehint')[0].style.display = "none";
    })

    $("#password-repeat").on('mouseout', function () {
        var password = document.getElementById("password").value;
        var password_repeat = document.getElementById("password-repeat").value;
        if (password != password_repeat) {
            $('#passwordrepeathint')[0].innerHTML = "2次密码输入有误";
            $('#passwordrepeathint')[0].style.display = "";
        } else {
            $('#passwordrepeathint')[0].style.display = "none";
        }
    })

})

function check() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var password_repeat = document.getElementById("password-repeat").value;

    if (password != password_repeat) {
        $('#registHint')[0].innerHTML = "2次密码输入有误";
        return false;
    }
    else {
        return true;
    }
}

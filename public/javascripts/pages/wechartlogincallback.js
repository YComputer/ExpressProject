/**
 * Created by hr on 2016/11/30.
 */
$(function () {
    $('#submitWechartLoginInfo').on('click', function () {
        //var loginname = $('#loginname')[0].value;
        var unionid = $("#unionid")[0].text();
        var nickname = $('#nickname')[0].value;
        var country = $('#country')[0].value;
        var province = $('#province')[0].value;
        var city = $('#city')[0].value;
        var sex = $('#sex')[0].value;
        var phonenumber = $('#phonenumber')[0].value;
        var email = $('#email')[0].value;
        var pass = $('#pass')[0].value;

        $.ajax({
            url: '/thirdloginsubmitinfo',
            method: "post",
            type: "application/json",
            data: {
                unionid: unionid,
                nickname: nickname,
                country: country,
                province: province,
                city: city,
                sex: sex,
                phonenumber: phonenumber,
                email: email,
                pass: pass
            },
            success: function (responseText) {
                if (responseText.error) {
                    var alertString = responseText.error;
                    $('#submitWechartLoginInfoMessage')[0].innerHTML = alertString;
                }
                else {
                    window.location.href = "/";
                }
            },
            error: function (err) {
                var alertString = "提交信息失败，请跳过，去逛逛";
                $('#submitWechartLoginInfoMessage')[0].innerHTML = alertString;
            }
        });
    });
    $('#phonenumber').on('blur', function () {
        checkInfo();
    });

    function checkInfo() {
        var phonenumber = $('#phonenumber')[0].value;
        var phonere = /^1\d{10}$/;
        var email = $('#email')[0].value;
        var pass = $('#pass')[0].value;
        var re_pass = $('#re_pass')[0].value;
        var phoneok = !phonere.test(phonenumber);
        var emailok = email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) == -1;
        var passequal = pass != re_pass;
        var passok = pass.length < 8;
        var alertString = "";
        if (phoneok) {
            alertString = "手机号码格式不正确";
        }
        if (emailok) {
            alertString = "邮箱格式不正确";
        }
        if (passequal) {
            alertString = "两次密码输入不一致";
        }
        if (passok) {
            alertString = "密码长度应不小于8位";
        }
        $('#submitWechartLoginInfoMessage')[0].innerHTML = alertString;
        if (phoneok || emailok || passequal || passok) {
            $('#submitWechartLoginInfo')[0].disabled = true;
        }
        else {
            $('#submitWechartLoginInfo')[0].disabled = false;
        }
    }

    $('#re_pass').on('blur', function () {
        checkInfo();
    });

    $('#email').on('blur', function () {
        checkInfo();
    });

})
/**
 * Created by hr on 2016/11/30.
 */
$(function () {

    $('#wechartLoginButton').on('click', function () {
        window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx687a3a4018ba8653&redirect_uri=http%3A%2F%2F8e3674be.ngrok.io%2Fwechartlogincallback&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect';
        //window.navigate('https://open.weixin.qq.com/connect/qrconnect?appid=wx687a3a4018ba8653&redirect_uri=http%3A%2F%2Fwww.01space.cn%2Fwechartlogincallback&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect');
        var obj = new WxLogin({
            id: "weichartImageDiv",
            appid: "wx687a3a4018ba8653",
            scope: "snsapi_login",
            redirect_uri: "http%3a%2f%2f.01space.cn",
            state: "STATE",
            style: "",
            href: ""
        });
    })

    $('#submitsignin').on('click', function () {
        var loginname = $('#loginname')[0].value;
        var pass = $('#pass')[0].value;
        if (!loginname || !pass) {
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
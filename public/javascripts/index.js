$(function () {
    $("#prevbtn").on("click", function () {

    })
    $("#nextbtn").on("click", function () {

    })
    $("#carousel").carousel('cycle');

    $.ajax({
        url: '/checkLoginStatus',
        method: "get",
        type: "application/json",
        success: function (data) {
            if (data.logined) {
                $("#loginBtn_a")[0].style.display = "none";
                $('#dropdownMenu1')[0].src = data.user.avatar;
                $("#userbtn_dropdown")[0].style.display = "block";
            }
            else {
                $("#loginBtn_a")[0].style.display = "block";

                $("#userbtn_dropdown")[0].style.display = "none";

            }
        },
        error: function (err) {

        }
    })

})
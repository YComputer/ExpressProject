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
            if (data) {
                $("#loginBtn_a")[0].style.display = "none";
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
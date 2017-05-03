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
            }
            else {
                $("#loginBtn_a")[0].style.display = "block";
            }
        },
        error: function (err) {

        }
    })

})
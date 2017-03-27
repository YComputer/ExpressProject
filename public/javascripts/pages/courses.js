$(function () {

    $(".courseListDiv").on("mouseover", function (item) {
        var id = item.currentTarget.id;

        $.ajax({
            url: "/courses/" + type + "/" + id + "/description",
            method: "GET",
            success: function (data) {
                $("#courseDescription")[0].textContent = data;
            },
            error: function (error) {
                console.log("can not find course info by id:" + id);
            }
        })



    })
})
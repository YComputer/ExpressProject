$(function () {

    $('#updateUserInfoBtn').on("click", function () {

        var name = $("#nameText")[0].value;
        var sex = $("#sexText")[0].value;
        var birth = $("#birthText")[0].value;
        var school = $("#schoolText")[0].value;
        var gread = $("#greadText")[0].value;
        var phone = $("#phoneText")[0].value;
        var province = $("#provinceText")[0].value;
        var city = $("#cityText")[0].value;
        var age = $("#ageText")[0].value;
        var address = $("#addressText")[0].value;
        $.ajax({
            type: "POST",
            url: "/user/updateinfo",
            data: {
                name: name,
                sex: sex,
                birth: birth,
                school: school,
                gread: gread,
                phone: phone,
                province: province,
                city: city,
                age: age,
                address: address
            },
            success: function (data) {
                if (data) {
                    alert("更新成功")
                }
                else {
                    alert("更新失败")
                }
            },
            failed: function (data) {
                alert("更新失败")
            }
        });

    })


})
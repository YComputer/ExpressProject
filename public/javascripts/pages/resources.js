$(function () {
    var input, uploader;

    input = $('#xfile')[0];


    uploader = new FileUp({
        endpoint: '/resource/'
    });

    input.addEventListener('change', function () {
        uploader.add(this.files[0]);
        uploader.work();
    });

    uploader.on('done', function (item) {

    });

    var responseId = "";

    uploader.on("success", function (item) {
        var  fileName = item.file.name;
        responseId = JSON.parse(item.xhr.response).id;

        $('#uploadResultModal').modal("show");

        var preview = '<img  src="/resources/'+fileName+'" width="482px" height="300px" ></img>';

        var player =  $('.player')[0];
        player.innerHTML=preview;

    })

    uploader.on("error", function (item) {
        uploader.items = [];
        uploader.queue = [];
    })

    uploader.on("abort", function (item) {
        alert("文件上传中断。");
    })

    $("#createResource").on('click', function () {
        var resourceType = $('input[name="resourceType"]:checked').val();
        var resourceName = $("#resourceName")[0].value;
        var resourceDescription = $("#resourceDescription")[0].value;
        $.ajax({
            url: "/resource/" + responseId,
            method: "post",
            data: {
                resourceType: resourceType,
                resourceName: resourceName,
                description: resourceDescription
            },
            success: function (data) {
                alert("保存成功");
            },
            error: function () {
                alert("保存失败");
            }
        })
    })
})
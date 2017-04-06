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
        responseId = JSON.parse(item.xhr.response).id;
        $('#uploadResultModal').modal("show");
        var autoStart = false;
        var lightContent = false;
        var hasUI = true;
        var resolution = 480;
        P.resolution = resolution;
        P.player.setResolution(resolution);
        document.body.style.width = resolution + 'px';
        if (lightContent) document.body.className += ' light-content';
        document.body.className += hasUI ? ' has-ui' : ' hide-ui';
        document.title = 'run the sb2';
        var request = P.IO.loadSB2File(item.file);
        P.player.showProgress(request, function (stage) {
            stage.triggerGreenFlag();
        });
        uploader.items = [];
        uploader.queue = [];
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
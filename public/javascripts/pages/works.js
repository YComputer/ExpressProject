$(function () {
    var input, uploader;

    input = $('#xfile')[0];

    uploader = new FileUp({
        endpoint: '/works'
    });

    input.addEventListener('change', function () {
        for (var i = this.files.length; i--;) {
            uploader.add(this.files[i]);
        }
        uploader.work();
        //uploader.submit();
    });

    uploader.on('done', function (item) {
        alert("文件上传完成。");
    });

    uploader.on("success", function (item) {
        alert("文件上传成功。");
    })

    uploader.on("error", function (item) {
        alert("文件上传失败。");
    })

    uploader.on("abort", function (item) {
        alert("文件上传中断。");
    })




})
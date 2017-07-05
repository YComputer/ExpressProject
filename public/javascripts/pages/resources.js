$(function () {
    var input, uploader;

    //上传的文件对象
    var fileUpload;

    input = $('#xfile')[0];


    uploader = new FileUp({
        endpoint: '/resource/'
    });

    input.addEventListener('change', function () {
        // uploader.add(this.files[0]);
        // uploader.work();

        fileUpload = this.files[0];
        $('#uploadResultModal').modal("show");

        var fileUpload2 = this.files[0];

        var $file = $(this);
        var fileObj = $file[0];
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        var $img = $("#preview");
        
        if(fileObj && fileObj.files && fileObj.files[0]){
            dataURL = windowURL.createObjectURL(fileObj.files[0]);
            $img.attr('src',dataURL);
        }else{
            dataURL = $file.val();
            var imgObj = document.getElementById("preview");
            // 两个坑:
            // 1、在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
            // 2、src属性需要像下面的方式添加，上面的两种方式添加，无效；
            imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
        
        }
    });


    uploader.on('done', function (item) {

    });

    var responseId = "";

    uploader.on("success", function (item) {
        //预览不需要上传
        // var  fileName = item.file.name;
        // responseId = JSON.parse(item.xhr.response).id;

        // $('#uploadResultModal').modal("show");

        // var preview = '<img  src="/resources/'+fileName+'" width="482px" height="300px" ></img>';

        // var player =  $('.player')[0];
        // player.innerHTML=preview;

        //上传成功后保存资源信息
        responseId = JSON.parse(item.xhr.response).id;
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
                 window.location.href='/resource';
            },
            error: function () {
                alert("保存失败");
            }
        })

    })

    uploader.on("error", function (item) {
        uploader.items = [];
        uploader.queue = [];
    })

    uploader.on("abort", function (item) {
        alert("文件上传中断。");
    })

    $("#createResource").on('click', function () {
        
        //点击创建资源首先上传，上传成功再保存数据
        // var imgpath = $("#preview")[0].src;
        // alert(imgpath);
        if(fileUpload){
            uploader.add(fileUpload);
            uploader.work();
        }
        
        // var resourceType = $('input[name="resourceType"]:checked').val();
        // var resourceName = $("#resourceName")[0].value;
        // var resourceDescription = $("#resourceDescription")[0].value;
        // $.ajax({
        //     url: "/resource/" + responseId,
        //     method: "post",
        //     data: {
        //         resourceType: resourceType,
        //         resourceName: resourceName,
        //         description: resourceDescription
        //     },
        //     success: function (data) {
        //         alert("保存成功");
        //     },
        //     error: function () {
        //         alert("保存失败");
        //     }
        // })
    })

    /**
     * 收藏资源/取消收藏
     */
    $('#favor').on('click', function () {

        //需要登录
        userRequired();
  
        var favor = $('#favor')[0].value;
        $.ajax({
            type: "POST",
            url: "/resourceFavor/",
            data: {
                favor: favor,
                responseId: responseId,              
            },
            success: function (data) {
                alert("保存成功");
                $('#favor')[0].value=1;
            },
            error: function () {
                alert("保存失败");
                 $('#favor')[0].value=0;
            }
        });
    })
})
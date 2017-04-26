$(function () {
    var input, uploader;

    input = $('#xfile')[0];

    uploader = new FileUp({
        endpoint: '/works'
    });

    input.addEventListener('change', function () {
        //I think this line is bug, as we do not need to upload all the files we select from the button (we can cancel )
        
        // we need to put the code in unloader.on to show the sb2 file
        
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
        //    stage.triggerGreenFlag();
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

    $("#createdWork").on('click', function () {
       
        var workName = $("#worknametext")[0].value;
        var workDiscription = $("#workdiscription")[0].value;
        $.ajax({
            url: "/works/" + responseId,
            method: "post",
            data: {
                name: workName,
                description: workDiscription
            },
            success: function (data) {
        
                
        var Pic = document.getElementsByTagName("canvas")[0];
        var Pic1 = document.getElementsByTagName("canvas")[1];
        var Pic2 = document.getElementsByTagName("canvas")[2];
        
        Pic.getContext("2d").drawImage(Pic1,0,0);
        Pic.getContext("2d").drawImage(Pic2,0,0);
                
        Pic = Pic.toDataURL("image/png");
        Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "");
 
    // Sending the image data to Server
                // alert(responseId);
        $.ajax({
           method: "post",
           url: "/thumbnail",
           data: { imageData :  Pic,
                    responseId :responseId
           },
           success: function (msg) {
            alert("缩略图上传完毕.");
          }
      });
        
                alert("保存成功");
            },
            error: function () {
                alert("保存失败");
            }
        })
     

        
    })
})
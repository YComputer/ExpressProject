$(function () {


    var pageSize = 20;
    var currentPage = 0;
    var pageNum = 1;
    var getworkcount = function () {
        $.ajax({
            type: "get",
            url: "/works/totalCount/get",
            success: function (data) {
                if (data) {
                    var count = data.data;
                    pageNum = Math.ceil(count / pageSize);
                    generatePageNav(pageNum);
                    console.log("作品总数：" + count);
                }
                else {
                    console.log("获取总数失败");
                }
            },
            failed: function (data) {
                console.log("获取总数失败");
            }
        })
    }
    getworkcount();

    // window.onscroll = function () {
    //     if ($(document).height() == $(window).height() + $(window).scrollTop()) {
    //         if (currentPage < pageNum) {
    //             currentPage++;
    //             getNextPageWorks(currentPage);
    //         }
    //     }
    // }

    var generatePageNav = function (pageCount) {
        var pagenavs;
        for (var i = 0; i < pageCount; i++) {
            var li = document.createElement("li");
            li.id = i;
            li.className = 'mui-table-view-cell';
            li.innerHTML = '<a>' + i + '</a>';
            $("#pageNavLast").before(li);
            //var s = '<li><a onlick="getPageWorks()">' + i + '</a></li>';
            //pagenavs += s;
        }
        //$("#pageNavFirst").after(pagenavs);
    }

    $('#pageNavs').on('click', 'li', function () {

        if (this.id == "pageNavFirst") {
            currentPageId = currentPageId-- < 0 ? 0 : currentPageId;
        }
        else if (this.id == "pageNavLast") {
            currentPageId = currentPageId++ > pageNum - 1 ? pageNum - 1 : currentPageId;
        }
        else
            currentPageId = this.id;
        console.log(currentPageId);
        getPageWorks(currentPageId);
    })

//     $("#searchWorkBtn").on('click', function(){
//         alert("hah");
//     });
    
    $("#searchWorkBtn").on('click', function () {
        var keyWord = $("#keyworkInput")[0].value;
        if (keyWord == undefined || keyWord == "") {
            return;
        }
        $.ajax({
            type: "get",
            url: "/works/search/" + keyWord + "/0",
            success: function (data) {
                if (data) {
                    var newPageWorks = data.data;
                    if (newPageWorks.length > 0) {
                        var html = generateNewRows(newPageWorks);
                        $("#allWorks").empty();
                        $("#allWorks").append(html);
                    }
                }
                else {
                    console.log("获取失败");
                }
            },
            failed: function (data) {
                console.log("获取失败");
            }
        })
    })

    var currentPageId = 0;

    function getPageWorks(nextPage) {
        $.ajax({
            type: "get",
            url: "/works/nextpage?pageid=" + nextPage,
            success: function (data) {
                if (data) {
                    var newPageWorks = data.data;
                    if (newPageWorks.length > 0) {
                        var html = generateNewRows(newPageWorks);
                        $("#allWorks").empty();
                        $("#allWorks").append(html);
                    }
                }
                else {
                    console.log("获取失败");
                }
            },
            failed: function (data) {
                console.log("获取失败");
            }
        })
    }
    getPageWorks(0);
    var getNextPageWorks = function (nextPage) {
        $.ajax({
            type: "get",
            url: "/works/nextpage?pageid=" + nextPage,
            success: function (data) {
                if (data) {
                    var newPageWorks = data.data;
                    if (newPageWorks.length > 0) {
                        var html = generateNewRows(newPageWorks);
                        $("#allWorks").append(html);
                    }
                }
                else {
                    console.log("获取失败");
                }
            },
            failed: function (data) {
                console.log("获取失败");
            }
        })
    }

    var generateNewRows = function (works) {
        var innerHtml = '<div class="row">';
        for (var i = 0; i < works.length; i++) {
            var newcolumn = generateNewColumn(works[i]);
            innerHtml += newcolumn;
            if (i != 0 && i % 4 == 3 && i + 1 < works.length) {
                innerHtml += '</div><div class="row">';
            }
            else if (i != 0 && i % 4 == 3 && i + 1 >= works.length) {
                innerHtml += '</div>'
            }
            else if (i % 4 != 3 && i + 1 >= works.length) {
                innerHtml += '</div>'
            }
        }
        return innerHtml;
    }

    var generateNewColumn = function (work) {
        var newcolumnhtml = '<div class="col-md-3" style="margin-bottom:20px">'
            + '<div style="background:write">'
            + '<div>'
            + '<a href="/works/' + work._id + '">'
            + '<img src="/thumbnail/' + work._id + '.png" style="max-width:100%" onerror="thumbnail404(this);"></img>'
            + '</a>'
            + '</div>'
            + '<div>'
            + '<a href="/works/>' + work._id + '">'
            + '<h3>' + work.name + '</h3>'
            + '</a>'
            + '<div class="row">'
            + '<div class="col-md-10">'
            + '<a href="/user/' + work.author + '">作者：' + work.author + '</a>'
            + '</div>'
            + '<div class="col-md-2">'
            + '<span>'
            + '<p>' + work.upCount + '</p>'
            + '</span>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'

        return newcolumnhtml;
    }

    var input, uploader;

    input = $('#xfile')[0];

    var filesb;

    uploader = new FileUp({
        endpoint: '/works'
    });

    input.addEventListener('change', function () {
        //I think this line is bug, as we do not need to upload all the files we select from the button (we can cancel )
        // we need to put the code in unloader.on to show the sb2 file
         $('#scratch-loader').show();
        var pics = document.getElementsByTagName("canvas");
        if(pics.length > 0){
            parent= pics[0].parentNode;
            parent.parentNode.removeChild(parent);
        }
        
        filesb = this.files[0];
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
        //document.title = 'run the sb2';
        //P.IO.PROJECT_URL = '#{Url}';
        //P.IO.SOUNDBANK_URL = '#{Url}';
        var request = P.IO.loadSB2File(this.files[0]);
        P.player.showProgress(request, function (stage) {
            //    stage.triggerGreenFlag();
             $('#scratch-loader').hide();
        });
        //uploader.items = [];
        //uploader.queue = [];
        //uploader.add(this.files[0]);
        //uploader.work();
    });

    uploader.on('done', function (item) {
        //alert("上传done");
    });

    uploader.on("success", function (item) {
        //alert("上传success");
        responseId = JSON.parse(item.xhr.response).id;

        var workRelativePath = responseId;
        var workName = $("#worknametext")[0].value;
        var workDiscription = $("#workdiscription")[0].value;

        $.ajax({
            url: "/works/" + responseId,
            method: "post",
            data: {
                relativeDestPath: workRelativePath,
                name: workName,
                description: workDiscription
            },
            success: function (data) {


                var Pic = document.getElementsByTagName("canvas")[0];
                var Pic1 = document.getElementsByTagName("canvas")[1];
                var Pic2 = document.getElementsByTagName("canvas")[2];

                Pic.getContext("2d").drawImage(Pic1, 0, 0);
                Pic.getContext("2d").drawImage(Pic2, 0, 0);

                Pic = Pic.toDataURL("image/png");
                Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "");

                // Sending the image data to Server
                // alert(responseId);
                $.ajax({
                    method: "post",
                    url: "/thumbnail",
                    data: {
                        imageData: Pic,
                        responseId: responseId
                    },
                    success: function (msg) {
                        alert("缩略图上传完毕.");
                    }
                });


                alert("上传成功");
                window.location.href = '/works';
            },
            error: function () {
                alert("上传失败");
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

    $("#createdWork").on('click', function () {
        //alert("strat")
        uploader.add(filesb);
        uploader.work();
        //alert("over")
    })
})
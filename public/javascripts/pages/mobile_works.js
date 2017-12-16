$(function () {


    var pageSize = 20;
    var currentPage = 0;
    var pageNum = 1;
    var getworkcount = function () {
        $.ajax({
            type: "get",
            url: "/mobile/works/totalCount/get",
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

    $("#searchWorkBtn").on('click', function () {
        var keyWord = $("#keyworkInput")[0].value;
        if (keyWord == undefined || keyWord == "") {
            keyWord = "undefined";
        }
        $.ajax({
            type: "get",
            url: "/mobile/works/search/" + keyWord + "/0",
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
            url: "/mobile/works/nextpage?pageid=" + nextPage,
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
            url: "/mobile/works//nextpage?pageid=" + nextPage,
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
            + '<a href="/mobile/works/' + work._id + '">'
            + '<img src="/thumbnail/' + work._id + '.png" style="max-width:100%" onerror="thumbnail404(this);"></img>'
            + '</a>'
            + '</div>'
            + '<div>'
            + '<a href="/mobile/works/>' + work._id + '">'
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

})
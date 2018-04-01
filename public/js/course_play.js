$(function () {
    var URL = location.href;
    var p = URL.substr(URL.indexOf('?')+1);
    var videoNamepair = p.substr(0,p.indexOf('&')) ;
    var videoName = videoNamepair.substr(videoNamepair.indexOf('=')+1) ;
    var courseNamePair = p.substr(p.indexOf('&')+1) ;
     var courseName = courseNamePair.substr(courseNamePair.indexOf('=')+1);
     document.getElementById("video").src = '/cours_MP4/'+courseName+'/'+videoName;
     document.getElementById("video").play();
     //$('#courseVideo').attr("src", '/cours_MP4/'+courseName+'/'+videoName);
})
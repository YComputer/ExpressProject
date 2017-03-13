/**
 * Created by hr on 2016/8/26.
 */

$(function(){
    $('#playvideo').on('click',function(){
        //$('#media')[0].play();
        var video = document.getElementById("media");
        //$('#media').pause
        if ($('#media')[0].paused || $('#media')[0].ended) {
            //playpause.title = "pause";
            //playpause.innerHTML = "pause";
            $('#media')[0].play();
        }
        else {
            //playpause.title = "play";
            //playpause.innerHTML = "play";
            $('#media')[0].pause();
        }
    })

    $('#playvideo')[0].onclick=function(){
        alert("haha");
    }
});

//function play(){
//    $('#media').play();
//}
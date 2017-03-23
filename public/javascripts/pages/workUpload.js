$(function () {
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

    var request = P.IO.loadSB2File(uploadedFile);
    P.player.showProgress(request, function (stage) {
        stage.triggerGreenFlag();
    });
})
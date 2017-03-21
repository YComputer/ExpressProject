/**
 * Created by hr on 2016/12/28.
 */
var list, input, uploader;

list = document.querySelector('ul#filelist');

list.get = function (index) {
    return this.querySelector('li[data-index="' + index + '"]');
};

$('#submit').on('click', function () {
    uploader.submit();
})

input = document.querySelector('input');

uploader = new FileUp({
    endpoint: '/test/upload_work'
});

input.addEventListener('change', function () {
    for (var i = this.files.length; i--;) {
        uploader.add(this.files[i]);
    }

    uploader.work();
});

uploader.on('add', function (item) {
    list.innerHTML += '<li data-index="' + item.index + '">' +
        item.file.name + ' [' + item.status + ']</li>';
});

uploader.on('progress', function (item, e) {
    list.get(item.index).innerHTML = item.file.name +
        ' [' + Math.round(e.loaded / e.total * 100) + '%]';
});

uploader.on('done', function (item) {
    list.get(item.index).innerHTML = item.file.name +
        ' [' + item.status + ']';
});
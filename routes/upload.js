/**
 * Created by hr on 2016/8/18.
 */

var express = require('express')
router = express.Router(),
    formidable = require('formidable'),
    fs = require('fs'),
    TITLE = 'formidable�ϴ�ʾ��',
    AVATAR_UPLOAD_FOLDER = '/avatar/'

/* GET home page. */
router.get('/', function(req, res) {
    res.render('upload', { title: TITLE });
});

    router.post('/', function(req, res) {

    var form = new formidable.IncomingForm();   //�����ϴ���
    form.encoding = 'utf-8';        //���ñ༭
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;     //�����ϴ�Ŀ¼
    form.keepExtensions = true;     //������׺
    form.maxFieldsSize = 2 * 1024 * 1024;   //�ļ���С

    form.parse(req, function(err, fields, files) {

        if (err) {
            res.locals.error = err;
            res.render('upload', { title: TITLE });
            return;
        }

        var extName = '';  //��׺��
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = 'ֻ֧��png��jpg��ʽͼƬ';
            res.render('upload', { title: TITLE });
            return;
        }

        var avatarName = Math.random() + '.' + extName;
        var newPath = form.uploadDir + avatarName;

        console.log(newPath);
        fs.renameSync(files.fulAvatar.path, newPath);  //������
    });

    res.locals.success = '�ϴ��ɹ�';
    res.render('upload', { title: TITLE });
});

module.exports = router;

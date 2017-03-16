/**
 * Created by hr on 2016/11/23.
 */
var express = require('express');

var router = express.Router();
var user = require('../controller/user');
var sign = require('../controller/sign');
var site = require('../controller/site');
var auth = require('../middlewares/auth');
var works = require('../controller/works');
var course = require('../controller/coursers');
router.get('/', site.index);

router.get('/signup', sign.showSignup);  // 跳转到注册页面
router.post('/signup', sign.signup);  // 提交注册信息
router.post('/signout', sign.signout);  // 登出
router.get('/signin', sign.showLogin);  // 进入登录页面
router.post('/signin', sign.login);  // 登录校验
router.get('/active_account', sign.activeAccount);  //帐号激活
//router.get('/works',auth.userRequired, works.listAll); //查看所有作品
router.get('/works', works.listAll); //查看所有作品
router.get('/works/:workid', works.showDetail);  //查看作品详情

router.get('/courses/:courseType', course.listAllCourse);
router.get('/user', user.listInfo);
router.post('/upload_work', works.upload);
router.get('/test/study/artical', works.getallartical);


router.post('/userss', user.create);


module.exports = router;
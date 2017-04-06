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
var comment = require('../controller/comment');
var message = require('../controller/message');
var resource = require('../controller/resource');


router.get('/', site.index);
router.get('/newsignin', sign.newsignin);
router.get('/newsignup', sign.newsignup);

router.get('/signup', sign.showSignup);  // 跳转到注册页面
router.post('/signup', sign.signup);  // 提交注册信息
router.post('/signout', sign.signout);  // 登出
router.get('/signin', sign.showLogin);  // 进入登录页面
router.post('/signin', sign.login);  // 登录校验
router.get('/active_account', sign.activeAccount);  //帐号激活
//router.get('/works',auth.userRequired, works.listAll); //查看所有作品
router.get('/works', works.listAll); //查看所有作品
router.get('/works/:workid', works.showDetail);  //查看作品详情
router.get('/works/:workid/full', works.showFull);

router.get('/courses/:courseType', course.listAllCourse);
router.get('/courses/:courseType/:courseId', course.showCourseDetail);
router.get('/courses/:courseType/:courseId/description', course.getCourseDescriptionById);
router.post('/comments', comment.postComment);
router.get('/user', user.listInfo);
router.post('/works', works.upload);
router.post('/works/:workid', works.saveWork);
router.get('/works/:workid/downresource', works.downLoad);
router.get('/test/study/artical', works.getallartical);


router.post('/userss', user.create);

router.get('/BBS/LastMessages', message.listLastNMessages);//查看最新留言
router.get('/BBS/message', message.showMessage);//新增留言
router.get('/BBS', message.listAll);//查看留言板


router.post('/BBS', message.publishMessage);//发布留言信息

//资源访问路由
router.get('/resource/:resourceType/:resourceId', resource.showResourceDetail);//查看资源详细信息
router.get('/resource/:resourceType', resource.listAllResource);//查看指定类型资源
router.get('/resource', resource.listAllResource);//查看所有资源
router.get('/resource/:resourceType/:resourceId/download', resource.download);//下载资源

router.post('/resource', resource.upload);//上传资源
router.post('/resource/:resourceId', resource.saveResource);//保存资源

module.exports = router;

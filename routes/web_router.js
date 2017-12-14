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
var create = require('../controller/create');
var static = require('../controller/static');


var remix = require('../controller/remix');
var saveToSite = require('../controller/saveToSite');


var mobile_works = require('../controller/mobile_works');

var thumbnail = require('../controller/thumbnail');


router.get('/', site.index);
router.get('/newsignin', sign.newsignin);
router.get('/newsignup', sign.newsignup);
router.get('/checkLoginStatus', sign.checkLoginStatus);

router.get('/static/aboutus', static.aboutus);
router.get('/static/contactus', static.contactus);
router.get('/static/joinus', static.joinus);
router.get('/static/partner', static.partner);
router.get('/static/serviceprotocol', static.serviceprotocol);
router.get('/static/news', static.news);
router.get('/static/otherproduct', static.otherproduct);

router.post('/signup', sign.signup);  // 提交注册信息
router.get('/signout', sign.signout);  // 登出
router.post('/signin', sign.login);  // 登录校验
router.get('/findpwd', sign.findpwd);  // 找回密码
router.post('/sendResetPwdMail', sign.sendResetPwdMail);  // 发送邮件-找回密码链接
router.get('/resetpwd', sign.page_reset_pwd);  // 重置密码
router.post('/resetpwd', sign.reset_pwd);  // 重置密码
router.get('/genVerifycode', sign.genVerifycode);  // 获取验证码

router.get('/activeAccount', sign.activeAccount);  //帐号激活

//router.get('/works',auth.userRequired, works.listAll); //查看所有作品
router.get('/works', works.listAll); //查看所有作品
router.get('/works/nextpage', works.getNextPage);
router.get('/works/:workid', works.showDetail);  //查看作品详情
router.get('/works/:workid/full', works.showFull);    //全屏播放作品
router.get('/works/:workid/evaluation', works.showEvaluation);
router.get('/works/totalCount/get', works.getTotalCount);  //获取作品总量
router.get('/create', create.showEditor);   //创作
router.get('/works/search/:keyword/:pageid', works.search);

router.get('/courses/', course.listAllCourse);
router.get('/courses/scratch/', course.scratchpage);
//router.get('/courses/:courseType', course.listAllCourse);
//router.get('/courses/:courseType/:courseId', course.showCourseDetail);
//router.get('/courses/:courseType/:courseId/description', course.getCourseDescriptionById);
router.post('/comments', comment.postComment);
router.post('/thumbsUp', works.thumbsUp);//点赞

router.get('/user', user.listInfo);
router.get('/getusernamebyid', user.getUserName);
router.post('/user/updateInfo', user.updateInfo);
router.post('/works', works.upload);
router.post('/works/:workid', works.saveWork);
router.get('/works/:workid/downresource', works.downLoad);


router.get('/remix/:workid', remix.remix);

router.post('/saveWorkToSite', saveToSite.upload);


router.get('/mobile/works', mobile_works.listAll);
router.get('/mobile/works/nextpage', mobile_works.getNextPage);
router.get('/mobile/works/:workid', mobile_works.showDetail);
router.get('/mobile/works/search/:keyword/:pageid', mobile_works.search);
router.get('/mobile/works/totalCount/get', mobile_works.getTotalCount);  //获取作品总量
router.get('/mobile/works/:workid/evaluation', mobile_works.showEvaluation);



router.post('/thumbnail', thumbnail.upload); //上传缩略图

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
router.post('/resourceFavor', resource.saveResource);//收藏资源


module.exports = router;

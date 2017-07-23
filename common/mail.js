/**
 * Created by yaohw@s2017年7月19日21:22:21
 */
var nodemailer = require("nodemailer");

var user = '01_space@sina.cn',
    pass = 'lijie1108';
var smtpTransport = nodemailer.createTransport({
    host: 'smtp.sina.cn',
    secureConnection: true,
    port: 25,
    auth: {
        user: '01_space@sina.cn',
        pass: 'lijie1108'
    }
});

/**
 * 发送邮件找回密码
 * @param email 用户邮箱地址
 * @param href  找回密码链接
 */
exports.sendResetPwdMail = function (email, href) {
    smtpTransport.sendMail(
        {
            from: '01space<' + user + '>',
            // to: '<'+'yaohongwei2012@126.com>'    ,
            to: '<' + email + '>',
            subject: '01space-找回密码',
            html: '这封信是由 01space 发送的。<p>您收到这封邮件，是由于在 01space 进行了用户找回密码 使用了这个邮箱地址。如果您并没有访问过 01space，或没有进行上述操作，请忽略这封邮件。您不需要退订或进行其他进一步的操作。</p>请点击下面的链接找回密码：\r\n <a href = "' + href + '">' + href + '</a><p></p><p>(如果上面不是链接形式，请将该地址手工粘贴到浏览器地址栏再访问）</p><p>感谢您的访问，祝您使用愉快！</p><p>此致 01space 管理团队</p>'
        }, function (err, res) {
            console.log(err, res);
        });
}
/**
 * 发送邮件激活用户
 * @param email 用户邮箱地址
 * @param href  找回密码链接
 */
exports.sendActiveMail = function (email, href) {
    smtpTransport.sendMail(
        {
            from: '01space<' + user + '>',
            // to: '<'+'yaohongwei2012@126.com>'    ,
            to: '<' + email + '>',
            subject: '01space-激活用户',
            html: '这封信是由 01space 发送的。<p>您收到这封邮件，是由于在 01space 进行了新用户注册 使用了这个邮箱地址。如果您并没有访问过 01space，或没有进行上述操作，请忽略这封邮件。您不需要退订或进行其他进一步的操作。</p>请点击下面的链接激活用户：\r\n <a href = "' + href + '">' + href + '</a><p></p><p>(如果上面不是链接形式，请将该地址手工粘贴到浏览器地址栏再访问）</p><p>感谢您的访问，祝您使用愉快！</p><p>此致 01space 管理团队</p>'
        }, function (err, res) {
            console.log(err, res);
        });
}
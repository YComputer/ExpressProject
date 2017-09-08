/**
 * Created by hr on 2016/11/23.
 */
var config = {
    port: 5000,
    // mongodb 配置
    mongo_db: 'mongodb://127.0.0.1:27017/test',

    //redis 配置
    redis_config: {
        redis_port: "6379",
        redis_host: "127.0.0.1",
        redis_db: 0,
        redis_password: ""
    },
    session_secret: '01space_org',
    auth_cookie_name: '01space',
    project_base_path: "/com/bin/ExpressProject/",
    host: 'http://127.0.0.1:5000/',
    mailSystem: {
        host: 'smtp.sina.cn',
        secureConnection: true,
        port: 25,
        auth: {
            user: '01_space@sina.cn',
            pass: 'lijie19871108'
        }
    }
};

exports.config = config;
/**
 * Created by hr on 2016/11/23.
 */
var config = {

    // mongodb 配置
    mongo_db: 'mongodb://127.0.0.1:27017/test',

    //redis 配置
    redis_config: {
        redis_port: "6379",
        redis_host: "127.0.0.1",
        redis_db: 0,
        redis_password: ""
    },
    session_secret: 'node_club_secret',
    auth_cookie_name: 'node_club',
    project_base_path: "/Users/lijie/项目/git/ExpressProject/"
};

exports.config = config;
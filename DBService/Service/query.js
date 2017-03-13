/**
 * Created by hr on 2016/9/5.
 */
var connection = require('../DataBaseConnection/DBConnection.js');
//var connection = require("../DBService/DataBaseConnection/DBConnection.js");

function getConnectionCallback(err, connection){
    if(err){
        console.error("�������ݿ�ʧ�ܣ�����ԭ��"+err.message);
    }
    else{
        queryName(connection);
    }
}

function queryName(connection){
    connection.query('select * from tyyj.t_user where username=?','lj',function(err, result){
       if(err){
           console.error("��ѯʧ�ܣ�")
       }
       else{
           console.log("First person:", result[0]);
       }
    });
}

exports.query = function(){
    connection.getPoolConnection(getConnectionCallback);
}
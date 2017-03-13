/**
 * Created by hr on 2016/8/29.
 */
function dbService(){

}
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'tyyj'
});

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'tyyj',
    connectionLimit:20,
    queueLimit:5,
});

exports.getPoolConnection = function(func){
    pool.getConnection(func);
}


exports.query=function(res){
    connection.connect(function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("���ӳɹ���");
        }
    });
    connection.query('SELECT * FROM tyyj.t_user', function(err, rows, fields) {
        if (err) {
            throw err;
            connection.end();
        }
        else{
            rows.forEach(function(row){
                res.send(row);
            });
            connection.end();
            //return rows;
            //console.log('The solution is: ', rows[0].solution);
        }
    });


}



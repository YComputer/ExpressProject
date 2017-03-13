/**
 * Created by hr on 2016/8/30.
 */

var orm=require("orm");
var User;
orm.connect("mysql://root:@localhost/tyyj", function (err, db) {
    User = db.define("t_user", {
        id      : Number,
        username   : String,
        password       : String, // FLOAT
        salt      : String
    });

    //User.find({ username: "lj" }, function (err, people) {
    //    // SQL: "SELECT * FROM person WHERE surname = 'Doe'"
    //    console.log("People found: %d", people.length);
    //    console.log("First person: %s, age %d", people[0].username, people[0].password);
    //    //people[0].age = 16;
    //    //people[0].save(function (err) {
    //    //    // err.msg = "under-age";
    //    //});
    //});
});

exports.query=function(res){
    User.find({ username: "lj" }, function (err, people) {
        // SQL: "SELECT * FROM person WHERE surname = 'Doe'"
        if(err){

        }
        else{
            console.log("First person: %s, age %d", people[0].username, people[0].password);
            res.send("People found: %d", people.length);
            //console.log("First person: %s, age %d", people[0].username, people[0].password);
        }

        console.log("People found: %d", people.length);
        console.log("First person: %s, age %d", people[0].username, people[0].password);
        //people[0].age = 16;
        //people[0].save(function (err) {
        //    // err.msg = "under-age";
        //});
    });
}



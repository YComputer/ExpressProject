/**
 * Created by hr on 2016/8/16.
 */
/**
 * Module dependencies.
 */

//var express = require('../../');
//var app = module.exports = express();

var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, response){
    var root = './public/avatar/';
    var res = getAllFiles(root);
    //var res = [] , files = fs.readdirSync(root);
    //files.forEach(function(file){
    //    var pathname = root+'/'+file
    //        , stat = fs.lstatSync(pathname);
    //    if (!stat.isDirectory()){
    //        res.push(pathname.replace(root,'.')); //
    //    } else {
    //        res = res.concat(getAllFiles(pathname));
    //    }
    //});

    var ss='<ul>';
    for(var i=0;i<res.length;i++){
        var s ='<li>Download<a href="/avatar/'+res[i]+'"'+
            '>'+res[i]+
            '</a></li>';
        ss+=s;
    }
    ss+='</ul>';
    //res.send(ss);

    if (response.send) response.send(ss);
        else response.end(ss);

    //res.end('<ul>'
    //    + '<li>Download <a href="/download/files/amazing.txt">amazing.txt</a>.</li>'
    //    + '<li>Download <a href="/download/files/missing.txt">missing.txt</a>.</li>'
    //    + '<li>Download <a href="/download/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>'
    //    + '</ul>');
});

// /files/* is accessed via req.params[0]
// but here we name it :file
router.get('/files/:file(*)', function(req, res, next){
    var file = req.params.file;
    var path = './public/avatar/+file';   //__dirname + '/files/' + file;

    res.download(path, function(err){
        if (!err) return; // file sent
        if (err && err.status !== 404) return next(err); // non-404 error
        // file for download not found
        res.statusCode = 404;
        res.send('Cant find that file, sorry!');
    });
});

function getAllFiles(root){
    var res = [] , files = fs.readdirSync(root);
    files.forEach(function(file){
        var pathname = root+'/'+file
         , stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()){
            res.push(pathname.replace(root,'').replace('/',''));
            } else {
            res = res.concat(getAllFiles(pathname));
            }
        });
    return res
    }
//var w_content=getAllFiles(root_path).join('\n');
//fs.readFile(root_path+w_file,function(err , data){
//    if(err && err.errno==33){
//        fs.open(w_file,"w",0666,function(e,fd){
//            if(e) throw e;
//            fs.write(fd,w_content,0,'utf8',function(e){
//                if(e) throw e;
//                fs.closeSync(fd);
//                })
//            });
//        } else{
//        fs.writeFile(root_path+w_file,w_content,function(e){
//            if(e) throw e
//            })
//        }
//    })


module.exports = router;

/* istanbul ignore next */
/*if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}*//*if (!module.parent) {
 app.listen(3000);
 console.log('Express started on port 3000');
 }*/

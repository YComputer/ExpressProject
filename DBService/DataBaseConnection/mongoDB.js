/**
 * Created by hr on 2016/9/18.
 */
//var async = require('yield-async');
var mongo= require("mongodb");
var host="localhost";
var port = 27017;
var server = new mongo.Server(host,port,{auto_reconnect:true});
var db=new mongo.Db("study",server,{safe:true});
db.open(function(err,db){
    if(err){
        console.log("MongoDB链接失败。")
    }
    else{
        console.log("MongoDB链接成功。")
    }
});

db.on("close",function(err,db){
   if(err){
       console.log(err);
       console.log("MongoDB关闭失败。")
   }
   else{
       console.log("MongoDB关闭成功。")
   }
});

//function openConnection(){
//    var p = new Promise(function(resolve,reject){
//        db.open(function(err,db){
//            if(err){
//                console.log("MongoDB链接失败。")
//                reject(err);
//            }
//            else{
//                console.log("MongoDB链接成功。")
//                resolve(db);
//            }
//        });
//    });
//    return p;
//}


function getCollection(collectionName){
    var p1 = new Promise(function(resolve, reject){
            db.collection(collectionName,function(error,collection){
                if(error){
                    console.log("MongoDB获取集合"+collectionName+"失败。")
                    reject(err);
                }else{
                    console.log("MongoDB获取集合"+collectionName+"成功。")
                    resolve(collection);
                }
            });
    })
    return p1;
}

function find(collection,document){
    var p = new Promise(function(resolve,reject){
       collection.find(document).toArray(function(err, docs){
          if(err){
              console.log("在集合："+collection.s.name+"中查找文档："+document+"失败。");
              reject(err);
          }
          else{
              console.log("在集合："+collection.s.name+"中查找文档："+document+"成功。");
             resolve(docs);
          }
       });
    });
    return p;
}

function update(collection,selector,document){
    var p = new Promise(function(resolve, reject){
        collection.update(selector,document,function(err, result){
            if(err){
                console.log("在集合："+collection.s.name+"中更新文档："+selector+"的值为"+document+"失败。");
                reject(err);
            }
            else{
                console.log("在集合："+collection.s.name+"中更新文档："+selector+"的值为"+document+"成功。");
                resolve(result);
            }
        })
    });
    return p;
}

function insert(collection,document){
    var p = new Promise(function(resolve, reject){
        collection.insert(document,function(error,docs){
            if(error){
                console.log("在集合："+collection.s.name+"中插入文档："+document+"失败。");
                reject(error);
            }else{
                console.log("在集合："+collection.s.name+"中插入文档："+document+"成功。");
                resolve(docs);
            }
        })
    });
    return p;
}

function remove(collection,selector){
    var p = new Promise(function(resolve, reject){
        collection.findAndRemove(selector,function(err, result){
            if(err){
                console.log("在集合："+collection.s.name+"中删除文档："+selector+"失败。");
                reject(error);
            }
            else{
                console.log("在集合："+collection.s.name+"中删除文档："+selector+"成功。");
                resolve(docs)
            }
        })
    })
}

exports.insertDocument=function (collectionName,document,callback){
    getCollection(collectionName).then(function(data){
        return insert(data,document);
    },function(reason,data){
        console.log(reason);
        callback(reason,data);
    }).then((data)=>{
        callback(bull,data);
    },(reason,data)=>{
        console.log(reason);
        callback(reason,data);
    });
}

exports.findDocument = function(collectionName,document,callback){
    getCollection(collectionName).then((data)=>{
        return find(data,document);
    },(reason,data)=>{
        console.log(reason);
        callback(reason, data);
    }).then((data)=>{
        callback(null,data);
    },(reason,data)=>{
        console.log(reason);
        callback(reason,data);
    });
}

exports.updateDocument = function(collectionName,selector,document,callback){
    getCollection(collectionName).then((data)=>{
        return update(data,selector,document);
    },(reason,data)=>{
        console.log(reason);
        callback(reason,data);
    }).then((data)=>{
        callback(null,data);
    },(reason,data)=>{
        console.log(reason);
        callback(reason,data);
    })
}

exports.removeDocument = function (collectionName,selector,callback){
    getCollection(collectionName).then((data)=>{
        return remove(data,selector);
    },(reason,data)=>{
        console.log(reason);
        callback(reason,data);
    }).then((data)=>{
        callback(null,data);
    },(reason,data)=>{
        console.log(reason);
        callback(reason,data);
    })
}

function getCollectionAsync(collectionName){
    openConnection().then(function(data){
        return getCollection(collectionName);
    },function(reason,data){
        console.log(reason);
    }).then(function(data){
        return data;
    },function(reason,data){
        console.log(reason);
    });
}




//
//Generate方式解决异步回调
//
//function get(collectionname,getCollection){
//
//    var collection_obj = getCollection(collectionname,resume);
//    function resume(){
//        var err=arguments[0];
//        if(err && err instanceof  Error){
//            return collection_obj.throw(err);
//        }
//        var data=arguments[1];
//        collection_obj.next(data);
//    }
//}
//
//
//run(function* getCollection(collectionName,resume){
//
//    db.open()
//
//    try {
//        var data = yield db.collection(collectionName,resume);
//    }
//    catch(e) {
//        console.log('get collection failed.');
//        return;
//    }finally{
//
//    }
//});
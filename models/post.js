var mongodb = require("../db");
var markdown = require("markdown").markdown;

function Post(name, title, post, label){
    this.name = name;
    this.title = title;
    this.post = post;
    this.label = label;     // 标签
}
module.exports = Post;

// 存储文章
Post.prototype.save = function(callback){
    var date = new Date();
    var time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
    }
    // 要存入的数据
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post
    }
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection("posts",function(err , collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            // 插入posts集合
            collection.insert(post, {
                safe:true
            },function(err){
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
};
Post.get = function(name, callback){
    // 打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        // 读取posts
        db.collection("posts", function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(name){
                query.name = name;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                  return callback(err);//失败！返回 err
                }
                docs.forEach(function(doc){
                    doc.post = markdown.toHTML(doc.post);
                })
                callback(null, docs)//成功！以数组形式返回查询的结果
            });
        })
    })
}
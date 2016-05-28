
var mongoose = require("mongoose");
// 创建一个数据库的连接
var db = mongoose.createConnection("localhost","blog");
// 定义一个 Schema
var adminSchema = new mongoose.Schema({
    name:String,
    password:String,
})
var adminModel = db.model("admin", adminSchema);
// 显示错误
db.on("error", console.error.bind(console,"连接错误"))
db.once('open',function(){
  //一次打开记录
  console.log("good");
  var newAdmin =  new adminModel({
    name:"yu",
    password:md5("aasd")
  });
  newAdmin.save();
  // 查找
  admin.find({},{},function(err,docs){
    console.log(docs);
    db.close()
  })
});
module.exports = db;
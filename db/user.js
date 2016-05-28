var mongoose = require("mongoose");
var db = mongoose.createConnection("localhost","blog");
var md5 = require("../main/md5")
var user = function(obj){
    this.name = obj.name;
    this.password = obj.password;
    this.email = obj.email;
}
module.exports = user
user.prototype.add = function() {
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };
    var userSchema = new mongoose.Schema({
        name:String,
        password:String,
        email:String,
        time:{
            type:Date,
            default: Date.now
        }
    });
    var userModel = db.model("users",userSchema);
    var userEntity = new userModel(user);
    userEntity.save(function(error){
        if(error){
            console.log(error);
        }else{ 
            console.log("Ok")
        }
        db.close();
    })
};
/*
user.prototype.get = function(u){
    var userModel = db.model("user",users);
    userModel.findOne({"id":u},function(err,doc){
        if(doc){
            return true;
        }else {
            return false
        }
    })
}
*/
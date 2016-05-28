var users = require("../db/user")

module.exports = function(app){
    app.get("/", function(req,res){
        res.render("index",{
            title: "主页"
        })
    })
    app.get("/reg", function(req,res){
        res.render("reg",{
            title: "注册"
        })
    })
    app.post("/reg", function(req,res){
        var user = new users({
            id:req.body.name,
            password:req.body.password,
            email:req.email
        })
        user.add()
    })
}
var crypto = require('crypto');         //生成散列值来加密密码
var User = require('../models/user.js');
var Post = require('../models/post.js');

/* GET home page. 主页 */
module.exports = function(app){
    // 主页
    app.get("/", function(req, res, next){
        Post.get(null, function(err, posts){
            if(err){
                posts = [];
            }
            res.render("index", {
                title: "主页",
                user: req.session.user,
                posts: posts,
                success: req.flash("success").toString(),
                error: req.flash("error").toString()
            })
        })
    });
    // 登录页面
    app.post("/login", function(req, res, next){
        var md5 = crypto.createHash("md5"),
              password = md5.update(req.body.password).digest("hex");
        User.get(req.body.name, function(err, user){
            if(!user){
                req.flash("error", "用户不存在");
                return res.redirect("/login");
            }
            // 密码对不对
            if(user.password != password){
                req.flash("error", "密码错误");
                return res.redirect("/login");
            }
            req.session.user = user;
            req.flash("success", "登录成功");
            res.redirect("/");
        })
    });
    app.get('/login', checkNotLogin);
    app.get("/login", function(req, res, next){
        res.render("login", { 
            title : "登录",
            user: req.session.user,
            success: req.flash("success").toString(),
            error: req.flash("error").toString()
        });
    });
    // 注册页面
    app.get('/reg', checkNotLogin);
    app.get("#/reg", function(req, res, next){
        res.render("reg", { 
            user: req.session.user,
            title : "注册",
            success: req.flash("success").toString(),
            error: req.flash("error").toString()
        });
    });
    app.post("/reg", function(req, res, next){
        var name = req.body.name,
              password = req.body.password,
              password_re = req.body['password-repeat'];
        if(password_re != password){
            req.flash("error", "两次输入的不一致")
            console.log("两次输入的不一致")
            return res.redirect("/reg")
        }
        var md5 = crypto.createHash("md5"),
              password = md5.update(req.body.password).digest("hex");
        var newUser = new User({
          name: name,
          password: password,
          email: req.body.email
        });
        console.log(newUser)
        User.get(newUser.name, function(err, user){
            if(err){
                req.flash("error", err);
                return res.redirect("/");
            }
            if(user){
                req.flash("error", "用户已存在");
                return res.redirect("/reg");// 返回注册页
            }
            newUser.save(function(err, user){
                if(err){
                    req.flash("error", err);
                    return res.redirect("/reg")
                }
                req.session.user = newUser; //用户信息存入session
                req.flash("success", "注册成功");
                res.redirect("/"); // 注册成功返回主页
            })
        })
    });
    // 发表文章页面
    app.post("/post", checkLogin)
    app.post("/post", function(req, res, next){
  var currentUser = req.session.user,
      post = new Post(currentUser.name, req.body.title, req.body.post);
          post.save(function (err) {
            if (err) {
              req.flash('error', err); 
              return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/');//发表成功跳转到主页
          });
    })
    app.get("/post", function(req, res, next){
        res.render("post", { 
            title : "发表文章",
            user: req.session.user,
            success: req.flash("success").toString(),
            error: req.flash("error").toString()
        });
    });
    app.post('/post', function (req, res) {
    });
    // 登出页面
    app.get('/logout', checkLogin);
    app.get("/logout", function(req, res, next){
        req.session.user = null;
        req.flash("success", "登出成功")
        res.redirect("/");
    });
    // 检测登录状态
    function checkLogin(req, res, next){
        if(!req.session.user){
            req.flash("error","未登录");
            res.redirect("/login");
        }
        next();
    }
    function checkNotLogin(req, res, next){
        if(req.session.user){
            req.flash("error","已登录");
            res.redirect("back");   //返回之前的页面
        }
        next();
    }
};

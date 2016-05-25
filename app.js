
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var settings = require("./settings");     // settings.js
var flash =require("connect-flash")     // flash模块
var session = require("express-session");         //express的session模块
var MongoStore = require("connect-mongo")(session);   // 连接数据库

var app = express();


/*
使用 express-session 和 connect-mongo 模块实现了将会化信息存储到mongoldb中。
ret 用来防止篡改 cookie，
**key** 的值为 cookie 的名字，
通过设置 cookie 的 maxAge 值设定 cookie 的生存期，
这里我们设置 cookie 的生存期为 30 天，
设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，
以避免丢失。
在后面的小节中，我们可以通过 req.session 获取当前用户的会话对象，
获取用户的相关信息。
*/
app.use(session({
  resave: false,
  saveUninitialized: true,  
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    url: 'mongodb://localhost/blog',
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));

// 将会话存储到db上


// 设置views为存放模板的地方
app.set('views', path.join(__dirname, 'views'));
// 设置试图模板引擎为ejs
app.set('view engine', 'ejs');

app.use(flash());

// 放置图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 加载日志中间件
app.use(logger('dev'));
// 加载解析json的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 吧app 传入routes
routes(app);
app.listen(app.get("port"),function(){
  console.log(" server "+ app.get("port"))
})
// 捕获404错误，并转发到错误处理器
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 捕获404错误，并转发到错误处理器。
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// 开发环境下的错误处理器
// 将错误信息渲染error模板并显示到浏览器中
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/

// 导出app实例
module.exports = app;

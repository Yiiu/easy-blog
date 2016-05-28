// 入口文件

var express = require("express");
var path = require("path")          // 路径
var routes = require("./routes/index")          // 路径
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, 'public')));
routes(app)
app.listen(app.get("port"),function(){
  console.log(" server "+ app.get("port"))
})
module.exports = app;
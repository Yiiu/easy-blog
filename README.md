# 简单的多人博客

使用mongodb+express完成一个多人博客

* / ：首页
* /login ：  用户登录
* /reg ：     用户注册
* /post ：   发表文章
* /logout ：登出

/login 和/reg只有没有登录的用户可以访问，/logout /post只能登录用户访问

使用session来记录用户登录状态
数据库保存用户信息
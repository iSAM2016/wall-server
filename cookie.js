var redis = require('redis');

var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var app = express();

// 使用 cookieParser 中间件;
// app.use(cookieParser());

// // session
// app.use(session({
//     name: 'session-name', // 这里是cookie的name，默认是connect.sid
//     secret: 'my_session_secret', // 建议使用 128 个字符的随机字符串
//     resave: true,
//     saveUninitialized: false,
//     // cookie: { maxAge: 60 * 1000, httpOnly: true },
//     store: new redisStore({
//         client: redis.createClient({
//             host: '127.0.0.1',
//             port: '6379',
//             db: 2,
//             pass: '',
//         })
//     })
// }));

// app.get('/', function (req, res, next) {
//     //我们往往需要signedCookies的长期保存特性，又需要session的不可见不可修改的特性。
//     if (req.session.isFirst || req.cookies.isFirst) {
//         console.log(req.session)
//         console.log(req.cookies)
//         res.send("欢迎再一次访问");
//     } else {
//         req.session.isFirst = 1;
//         res.cookie('isFirst', 1, {
//             maxAge: 60 * 1000,
//             singed: true
//         });
//         res.send("欢迎第一次访问。");
//     }
// });

// app.listen(3030, function () {
//     console.log('express start on: ' + 3030)
// });

const ace = require('@adonisjs/ace');
ace.command(
  'greet {name: Name of the user to greet}',
  'Command description',
  function({ name }) {
    console.log(`Hello ${name}`);
  },
);

// Boot ace to execute commands
ace.wireUpWithCommander();
ace.invoke();

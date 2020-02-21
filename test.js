"use strict";
// // function f() {
// //   console.log('f(): evaluated');
// //   return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
// //     let oldMethod = descriptor.value;
// //     console.log('f');
// //     descriptor.value = function(...arg) {
// //       console.log('f start');
// //       // console.log(JSON.stringify(oldMethod));
// //       let value = oldMethod.apply(this, arguments);
// //       console.log('f' + value);
// //       console.log('f end');
// //     };
// //   };
// // }
exports.__esModule = true;
// // function g() {
// //   console.log('g(): evaluated');
// //   return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
// //     let oldMethod = descriptor.value;
// //     console.log('g');
// //     descriptor.value = function(...arg) {
// //       console.log('g start');
// //       let value = oldMethod.apply(this, arguments);
// //       console.log('g' + value);
// //       console.log('g end');
// //       return value + 'tom';
// //     };
// //   };
// // }
// // function d() {
// //   console.log('d(): evaluated');
// //   return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
// //     let oldMethod = descriptor.value;
// //     console.log('d');
// //     descriptor.value = function(...arg) {
// //       console.log('d start');
// //       let value = oldMethod.apply(this, arguments);
// //       console.log('d' + value);
// //       console.log('d end');
// //       return value + 'd';
// //     };
// //   };
// // }
// // class C {
// //   @f()
// //   @g()
// //   @d()
// //   method() {
// //     console.log(9);
// //     return 'isam2026';
// //   }
// // }
// // let c = new C();
// // c.method();
// // class PersonDAO {
// //   email: string;
// //   password: string;
// // }
// // @Singleton
// // class PersonService {
// //   private personDAO: PersonDAO;
// //   constructor() {
// //     this.personDAO = {
// //       email: '12289',
// //       password: '123',
// //     };
// //   }
// //   getEmail() {
// //     console.log(this.personDAO.email);
// //   }
// //   setEmail(value) {
// //     this.personDAO.email = value;
// //   }
// // }
// // class PersonController {
// //   @Inject
// //   private personService: PersonService;
// //   public getEmail() {
// //     this.personService.getEmail();
// //   }
// //   public setEmail(value) {
// //     this.personService.setEmail(value);
// //   }
// // }
// // let controller1: PersonController = new PersonController();
// // let controller2: PersonController = new PersonController();
// // controller1.getEmail();
// // controller2.getEmail();
// // controller1.setEmail('9090');
// // controller1.getEmail();
// // controller2.getEmail();
// // abstract class IBaseType {
// //   public abstract method1(): void;
// // }
// // @Provides(IBaseType)
// // export default class ChildType implements IBaseType {
// //   public method1(): void {
// //     // tslint:disable-next-line:no-console
// //     console.log('Foo bar');
// //   }
// // }
// // export class Worker {
// //   @Inject public type: IBaseType;
// //   public work() {
// //     this.type.method1();
// //   }
// // }
// // let work1: Worker = new Worker();
// // work1.work();
// /////////////////////////////////////////////
// var redis = require('redis');
// var path = require('path');
// var express = require('express');
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var redisStore = require('connect-redis')(session);
// var app = express();
// // 使用 cookieParser 中间件;
// // app.use(cookieParser());
// // // session
// // app.use(session({
// //     name: 'session-name', // 这里是cookie的name，默认是connect.sid
// //     secret: 'my_session_secret', // 建议使用 128 个字符的随机字符串
// //     resave: true,
// //     saveUninitialized: false,
// //     // cookie: { maxAge: 60 * 1000, httpOnly: true },
// //     store: new redisStore({
// //         client: redis.createClient({
// //             host: '127.0.0.1',
// //             port: '6379',
// //             db: 2,
// //             pass: '',
// //         })
// //     })
// // }));
// // app.get('/', function (req, res, next) {
// //     //我们往往需要signedCookies的长期保存特性，又需要session的不可见不可修改的特性。
// //     if (req.session.isFirst || req.cookies.isFirst) {
// //         console.log(req.session)
// //         console.log(req.cookies)
// //         res.send("欢迎再一次访问");
// //     } else {
// //         req.session.isFirst = 1;
// //         res.cookie('isFirst', 1, {
// //             maxAge: 60 * 1000,
// //             singed: true
// //         });
// //         res.send("欢迎第一次访问。");
// //     }
// // });
// // app.listen(3030, function () {
// //     console.log('express start on: ' + 3030)
// // });
// const ace = require('@adonisjs/ace');
// ace.command(
//   'greet {name: Name of the user to greet}',
//   'Command description',
//   function({ name }) {
//     console.log(`Hello ${name}`);
//   },
// );
// // Boot ace to execute commands
// ace.wireUpWithCommander();
// ace.invoke();
var queryString = require("query-string");
var url = '/data.gif?d=%7B%22type%22%3A%22BEHAVIOR_XHR%22%2C%22info%22%3A%7B%22message%22%3A%22%E5%BC%82%E6%AD%A5%E8%AF%B7%E6%B1%82%22%2C%22url%22%3A%22http%3A%2F%2Fcsszgl.shouzan365.com%3A80%2Fback%2Foperate%2Fpage%3Fkeywords%3D%26current%3D1%26pageSize%3D10%26types%3D0%22%2C%22method%22%3A%22GET%22%2C%22status%22%3A200%2C%22code%22%3A0%2C%22responseSize%22%3Anull%2C%22statusText%22%3A%22%22%2C%22success%22%3Atrue%2C%22duration%22%3A601%2C%22requestDate%22%3Anull%7D%2C%22options%22%3A%7B%22project_id%22%3A1%2C%22origin%22%3A%22http%3A%2F%2F101.200.123.5%3A9090%22%2C%22isTest%22%3Afalse%2C%22frequency%22%3A1%2C%22userId%22%3A%22wall_l5kGrBt7lS8iDGVxxu9vsDhhEY2M90Qj%22%2C%22uuid%22%3A%22wall_uuidFm1aIQuJPkLinppNpytWkFte6aZzi9Ah%22%7D%2C%22userId%22%3A%22wall_l5kGrBt7lS8iDGVxxu9vsDhhEY2M90Qj%22%2C%22uuid%22%3A%22wall_uuidFm1aIQuJPkLinppNpytWkFte6aZzi9Ah%22%2C%22key%22%3A%22tY0VS2qYgtKJ8PVPRy6rAN3ed5uY4nbz%22%2C%22project_id%22%3A1%2C%22version%22%3A%220.2.7%22%2C%22createTime%22%3A1582252529679%2C%22currentUrl%22%3A%22http%253A%252F%252Fcsszgl.shouzan365.com%252F%2523%252Foperation%252Fmange%22%7D';
console.log(queryString.parseUrl(url).query.d);
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

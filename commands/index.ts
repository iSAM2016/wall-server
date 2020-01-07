/* 跑批任务
 * @Author: isam2016
 * @Date: 2019-12-30 16:00:39
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-07 14:24:14
 */

import 'reflect-metadata';

import * as ace from '@adonisjs/ace';
// import configLoad from './utils/configLoad';

@modifyClass('new Prop')
class A {
  @modifyProp type: string;
  name: string;

  constructor(name) {
    this.name = name;
  }

  @modifyMethod
  say(@modifyParam word) {
    // let str = Reflect.getMetadata(key, this);
    // console.log(str);
  }
}

// 在装饰类的装饰器上获得target(类)是类本身
// 在装饰属性、方法、入参上获得的target的是类的原型target(属性、方法、入参) === target(类).prototype
function modifyClass(name) {
  return target => {
    target.prototype.extra = name;
  };
}

function modifyProp(target, propertyKey) {
  // 修改属性
  // console.log(target);
  // console.log(propertyKey);
  // console.log('99');
  target[propertyKey] = 'modfiyed by decorator';
}

// 我们在 ts 版本的 vuex 装饰器中看到的 @state('key') key 等价于
// function state (key) {
//   return (target, propertyKey) => {
//     target[propertyKey] = target.$store.state[key]
//   }
// }

// 修饰方法
// descriptor对象原来的值如下
// {
//   value: specifiedFunction,
//   enumerable: false,
//   configurable: true,
//   writable: true
// };
function modifyMethod(target, propertyKey, descriptor) {
  console.log(99);
  Reflect.defineMetadata(propertyKey, 'Hello Reflect', target);
  const fun = descriptor.value;
  descriptor.value = function() {
    console.log(this); // 运行时确定因此这里是的 this 指向实例的。如果这里是箭头函数，this则指向undefined
    return fun.apply(this, arguments);
  };
}

// 修饰入参
// index 是这个参数的顺序
function modifyParam(target, propertyKey, index) {
  console.log(target);
  console.log(propertyKey);
  console.log(index);
}
let a = new A('isam217');

console.log('a.name is');
console.log(JSON.stringify(a));
console.log(A);

const registedCommandList = [
  './demo', //  命令demo

  // 解析日志
  './commands/parse/uv', //  解析uv
  //   './commands/parse/time_on_site', // 解析用户停留时长
  //   './commands/parse/device', //  解析device
  //   './commands/parse/monitor', //  解析错误报警
  //   './commands/parse/menu_click', //  解析菜单点击记录

  //   './commands/parse/performance', //  解析性能统计指标数据
  //   './commands/parse/user_first_login_at', //  录入新增用户

  //   './commands/save_log/parseKafkaLog', //  将kafka日志落在文件中
  //   './commands/save_log/parseNginxLog', // 将ngnix日志落在文件中
  //   // 从数据库中, 按时间段统计
  //   './commands/summary/uv', //  统计uv数据
  //   './commands/summary/time_on_site', //  统计用户停留时长
  //   './commands/summary/system_os.js', // 按月统计系统分布, 每天跑
  //   './commands/summary/system_browser.js', // 按月统计浏览器分布, 每天跑
  //   './commands/summary/system_device.js', // 按月统计设备分布, 每天跑
  //   './commands/summary/system_runtime_version.js', // 按月统计版本分布，每天跑
  //   './commands/summary/http_error.js', // 按天统计http error分布, 每天跑
  //   './commands/summary/performance', //  按小时/天/月统计性能指标
  //   './commands/summary/new_user_summary', //  统计新增用户数
  //   './commands/summary/error_summary', // 统计某一错误的数量
  //   // 监控
  //   './commands/watch_dog/saas', //  saas监控
  //   './commands/watch_dog/alarm',

  //   './commands/create_cache/update_per_ten_minute', // 更新缓存

  //   // 任务调度
  //   './commands/task/manage', //  任务调度

  //   // 工具类命令
  //   './commands/utils/template_sql', // 生成模板数据
  //   './commands/utils/generate_sql', //  生成SQL
  //   './commands/utils/clean_old_log', //  自动删除旧日志
  //   './commands/utils/test', //  专业粘贴调试代码

  //   // 测试uc
  //   './commands/utils/testUC',
];

// register commands
// for (let command of registedCommandList) {
//   ace.addCommand(require(command)['default']);
// }
// ace.onError(function(error, commandName) {
//   console.log(`${commandName} reported ${error.message}`);
//   // process.exit(1);//TODO: 是否退出
// });

// // Boot ace to execute commands
// ace.wireUpWithCommander();
// ace.invoke();

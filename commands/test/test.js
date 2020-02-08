var assert = require('assert');
var shell = require('shelljs');

// console.log(process.env);

const knex = require('knex');
let a = knex({
  client: 'mysql',
  connection: {
    host: process.env.WORDPRESS_DB_HOST,
    port: 3306,
    user: 'root',
    password: 'abc123456',
    database: 'nest',
  },
  debug: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 100,
    reapIntervalMillis: 150,
  },
  acquireConnectionTimeout: 60000,
  log: {
    error(message) {
      console.log(message);
    },
  },
})
  .from('t_r_behavior_distribution')
  .select('id')
  .catch(err => {
    console.log(err);
    return [];
  });
a.then(e => {
  console.log(e);
});
// console.log(a);

// describe('测试命令行', function() {
//   // var manage = new Manage();
//   it('test => 任务调度', function() {
//     shell.exec('NODE_ENV=development node ../dist/index.js Task:Manger');
//   });
//   // it('test =>sql调度', function() {
//   //   shell.exec(
//   //     "node ../dist/index.js Utils:GenerateSQL 1,12 '2020-01' '2020-12' > ../../int.sql",
//   //   );
//   // });
//   //   it('test =>测试读取nginx 日志', function() {
//   //     shell.exec(' NODE_ENV=test node ../dist/index.js SaveLog:Nginx');
//   //   });
//   // it('test =>测试解析uv(设备访问)日志', function() {
//   //   shell.exec(
//   //     "NODE_ENV=test node ../dist/index.js Parse:UV '2020-02-07 07:21' '2020-02-07 07:21'",
//   //   );
//   // });
//   // it('test =>测试 用户停留时间', function() {
//   //   shell.exec(
//   //     "NODE_ENV=test node ../dist/index.js Parse:TimeOnSiteByHour '2020-02-07 07:21' '2020-02-07 07:21'",
//   //   );
//   // });
//   // it('test =>统计设备信息', function() {
//   //   shell.exec(
//   //     "NODE_ENV=test node ../dist/index.js Parse:Device '2020-02-07 07:21' '2020-02-07 07:21'",
//   //   );
//   // });
//   // it('test => 点击', function() {
//   //   shell.exec(
//   //     "NODE_ENV=test node ../dist/index.js Parse:MenuClick  '2020-02-07 07:21' '2020-02-07 07:21'",
//   //   );
//   // });
//   // it('test => 测试用户第一次登陆', function() {
//   //   shell.exec(
//   //     "NODE_ENV=test node ../dist/index.js Parse:UserFirstLoginAt   '2020-02-07 07:21' '2020-02-07 07:21'",
//   //   );
//   // });
// });

// 'Parse:Performance',
// 'Parse:Monitor',

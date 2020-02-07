var assert = require('assert');
var shell = require('shelljs');
describe('测试命令行', function() {
  // var manage = new Manage();
  //   it('test => 任务调度', function() {
  //     shell.exec(' NODE_ENV=test node ./index.js Task:Manger');
  //   });
  // it('test =>sql调度', function() {
  //   shell.exec(
  //     "node ../dist/index.js Utils:GenerateSQL 1,12 '2020-01' '2020-12' > ../../int.sql",
  //   );
  // });
  //   it('test =>测试读取nginx 日志', function() {
  //     shell.exec(' NODE_ENV=test node ../dist/index.js SaveLog:Nginx');
  //   });
  // it('test =>测试解析uv(设备访问)日志', function() {
  //   shell.exec(
  //     "NODE_ENV=test node ../dist/index.js Parse:UV '2020-02-07 07:21' '2020-02-07 07:21'",
  //   );
  // });
  // it('test =>测试 用户停留时间', function() {
  //   shell.exec(
  //     "NODE_ENV=test node ../dist/index.js Parse:TimeOnSiteByHour '2020-02-07 07:21' '2020-02-07 07:21'",
  //   );
  // });
  // it('test =>统计设备信息', function() {
  //   shell.exec(
  //     "NODE_ENV=test node ../dist/index.js Parse:Device '2020-02-07 07:21' '2020-02-07 07:21'",
  //   );
  // });
  // it('test => 点击', function() {
  //   shell.exec(
  //     "NODE_ENV=test node ../dist/index.js Parse:MenuClick  '2020-02-07 07:21' '2020-02-07 07:21'",
  //   );
  // });
  it('test => 测试用户第一次登陆', function() {
    shell.exec(
      "NODE_ENV=test node ../dist/index.js Parse:UserFirstLoginAt   '2020-02-07 07:21' '2020-02-07 07:21'",
    );
  });
});

// 'Parse:Performance',
// 'Parse:Monitor',

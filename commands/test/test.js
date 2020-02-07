var assert = require('assert');
import * as shell from 'shelljs';
describe('测试命令行', function() {
  // var manage = new Manage();
  //   it('test => 任务调度', function() {
  //     shell.exec(' NODE_ENV=test node ./index.js Task:Manger');
  //   });
  // it('test =>sql调度', function() {
  //   shell.exec(
  //     "node ../index.js Utils:GenerateSQL 13 '2020-01' '2020-12' > ../../../int.sql",
  //   );
  // });

  //   it('test =>测试读取nginx 日志', function() {
  //     shell.exec(' NODE_ENV=test node ../index.js SaveLog:Nginx');
  //   });
  it('test =>测试解析uv(设备访问)日志', function() {
    shell.exec(
      "NODE_ENV=test node ../index.js Parse:UV '2020-02-07 07:21' '2020-02-07 07:21'",
    );
  });
});

// 'Parse:UV',
// 'Parse:TimeOnSiteByHour',
// 'Parse:Performance',
// 'Parse:Monitor',
// 测试

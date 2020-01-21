var assert = require('assert');
import * as shell from 'shelljs';
import Manage from '../feature/task/manage';
describe('测试命令行', function() {
  // var manage = new Manage();
  it('test => 任务调度', function() {
    shell.exec('node ../index.js Task:Manger');
  });
  // it('test =>sql调度', function() {
  //   shell.exec(
  //     "node ../index.js Utils:GenerateSQL 13 '2018-10' '2018-11' > ../../../int.sql",
  //   );
  // });
});

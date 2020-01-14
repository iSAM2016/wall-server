var assert = require('assert');
import * as shell from 'shelljs';

describe('测试命令行', function() {
  it('test => 任务调度', function() {
    shell.exec('node ../index.js Task:Manger');
  });
});

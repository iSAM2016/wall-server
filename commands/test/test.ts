var assert = require('assert');
import * as shell from 'shelljs';
import Manage from '../commands/task/manage';
describe('测试命令行', function() {
  var manage = new Manage();
  it('test => 任务调度', function() {
    // manage.registerTaskRepeatPer1Minute();
    // shell.exec('node ../index.js Task:Manger');

    const schedule = require('node-schedule');
    console.log('scheduleCronstyle:' + new Date());
    function scheduleCronstyle() {
      schedule.scheduleJob('15 */10 * * * * ', function() {
        console.log('scheduleCronstyle:' + new Date());
      });
    }

    scheduleCronstyle();
  });
});

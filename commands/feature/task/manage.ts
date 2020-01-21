/* 任务调度系统 核心
 * @Author: isam2016
 * @Date: 2020-01-14 16:08:44
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 18:08:16
 */
import * as _ from 'lodash';
import * as path from 'path';
import * as moment from 'moment';
import * as shell from 'shelljs';
import * as schedule from 'node-schedule';
import { sleep } from '@commands/utils';
import CommandsBase from '../commandsBase';
import { CommandsModuleInterface } from 'commands/utils/interface';
import {
  UNIT,
  appConfig,
  DISPLAY_BY_MILLSECOND,
  COMMAND_ARGUMENT_BY_HOUR,
  COMMAND_ARGUMENT_BY_MINUTE,
} from '@commands/config';

class TaskManger extends CommandsBase implements CommandsModuleInterface {
  constructor() {
    super();
  }
  static get signature() {
    return `Task:Manger`;
  }

  static get description() {
    return '调度任务中心，只能启动一次';
  }

  async handle(arg, options) {
    this.log('主任务启动');
    this.log('关闭其他taskManger进程');
    await this.claoseOtherTaskManger();
    this.log('其他TaskManager进程已关闭');
    this.log('避免当前还有正在运行的save2Log命令, 等待30s');
    this.log('开始休眠');
    for (let i = 0; i < 1; i++) {
      await sleep(1 * 1000);
      this.log(`休眠中, 第${i + 1}秒`);
    }
    this.log('休眠完毕');
    this.log('开始注册cron任务');
    // 注册定时任务
    this.log('注册每分钟执行一次的任务');
    // this.registerTaskRepeatPer1Minute();
    this.log('注册每10分钟执行一次的任务');
    this.registerTaskRepeatPer10Minute();
  }
  // 关闭其他进程
  async claoseOtherTaskManger() {
    let taskManagerPidList = await this.getOtherTaskMangerPidList();
    console.log(taskManagerPidList);
    this.log('当前process.pid => ', process.pid);
    this.log(`其余TaskManger进程Pid列表 => `, taskManagerPidList);
    this.log('执行kill操作, 关闭其余进程');
    for (let pid of taskManagerPidList) {
      this.log(`kill pid => ${pid}`);
      try {
        process.kill(pid);
      } catch (e) {
        let message = `TaskManger进程pid => ${pid} kill失败, 该pid不存在或者没有权限kill`;
        this.log(message);
      }
    }
  }
  // 获取当前正在运行的进程
  async getOtherTaskMangerPidList() {
    // 命令本身也会被检测出来, sh -c npm run warning && NODE_ENV=development node dist/fee.js "Task:Manager"
    // grep not =>  grep -v 'pattern':可匹配得到除下指定pattern外的所有lines。
    let command: string =
      'ps aS | grep Task:Manger | grep node | grep -v grep | grep -v \'"Task:Manger"\'';
    this.log(`检测命令=> ${command}`);
    let rawCommandOutput = shell.exec(command, {
      async: false,
      silent: true,
    });
    let rawCommandOutputList = rawCommandOutput.split('\n');
    let taskManagerPidList = [];
    for (let rawCommandOutput of rawCommandOutputList) {
      let commandOutput = _.trim(rawCommandOutput);
      commandOutput = _.replace(commandOutput, '\t', ' ');
      let pid = commandOutput.split(' ')[0];
      pid = parseInt(pid);
      if (_.isNumber(pid) && pid > 0) {
        if (pid !== process.pid) {
          taskManagerPidList.push(pid);
        }
      }
    }
    return taskManagerPidList;
  }
  /**
   *  1分钟任务
   */
  registerTaskRepeatPer1Minute() {
    let that = this;
    schedule.scheduleJob('*/1 * * * * * ', () => {
      that.log('registerTaskRepeatPer1Minute 开始执行');
      let nowByMinute = moment().format(COMMAND_ARGUMENT_BY_MINUTE);
      let twoMinuteAgoByMinute = moment()
        .subtract(2, 'minute')
        .format(COMMAND_ARGUMENT_BY_MINUTE);
      let threeMinuteAgoByMinute = moment()
        .subtract(3, 'minute')
        .format(COMMAND_ARGUMENT_BY_MINUTE);
      let fourMinuteAgoByMinute = moment()
        .subtract(4, 'minute')
        .format(COMMAND_ARGUMENT_BY_MINUTE);
      let fiveMinuteAgoByMinute = moment()
        .subtract(5, 'minute')
        .format(COMMAND_ARGUMENT_BY_MINUTE);
      let tenMinuteAgoByMinute = moment()
        .subtract(10, 'minute')
        .format(COMMAND_ARGUMENT_BY_MINUTE);
      that.log(`[按分钟] 每分钟启动一次SaveLog `);
      that.execCommand('SaveLog:Nginx', []);

      that.log(`[按分钟] 每分钟启动一次Watch:Alarm, 监控平台运行情况 `);
      // that.execCommand('Watct:Alarm', []); //TODO:
    });
  }
  /**
   * 每10分钟启动一次
   */
  async registerTaskRepeatPer10Minute() {
    let that = this;
    // 每10分钟的第30秒启动
    // schedule.scheduleJob('15 */10 * * * * *', function() {
    schedule.scheduleJob('*/3  * * * * *', function() {
      that.log('registerTaskRepeatPer10Minute 开始执行');

      let nowByHour = moment().format(COMMAND_ARGUMENT_BY_HOUR);
      let nowByMinute = moment().format(COMMAND_ARGUMENT_BY_MINUTE);

      let oneHourAgoByHour = moment()
        .subtract(1, 'hours')
        .format(COMMAND_ARGUMENT_BY_HOUR);

      let fifteenMinuteAgoByminute = moment()
        .subtract(15, 'minute')
        .format(COMMAND_ARGUMENT_BY_MINUTE);

      // 周期性执行命令
      let intervalCommandList = ['CreateCache:UpdatePerOneMinute'];
      for (let intervalCommand of intervalCommandList) {
        // 周期性执行命令
        // that.execCommand(intervalCommand); //TODO: 更新缓存
      }

      let parseCommandList = [
        // 'Parse:UV',
        // 'Parse:TimeOnSiteByHour',
        'Parse:Performance',
        // 'Parse:Monitor',
      ];
      for (let parseCommand of parseCommandList) {
        // 解析最近15分钟内的数据
        that.dispatchParseCommand(
          parseCommand,
          fifteenMinuteAgoByminute,
          nowByMinute,
        );
      }

      // 汇总命令
      let summaryCommandList = [
        'Summary:UV',
        'Summary:NewUser',
        'Summary:Performance',
        'Summary:Error',
      ];
      // for (let summaryCommand of summaryCommandList) {
      //   // 当前小时
      //   that.dispatchParseCommand(
      //     summaryCommand,
      //     nowByHour,
      //     DATE_FORMAT.UNIT.HOUR,
      //   );
      //   // 一小时前
      //   that.dispatchParseCommand(
      //     summaryCommand,
      //     oneHourAgoByHour,
      //     DATE_FORMAT.UNIT.HOUR,
      //   );
      // }

      that.log('registerTaskRepeatPer10Minute 命令分配完毕');
    });
  }

  /**
   * 执行command 命令行
   */
  execCommand(commandName, args = []) {
    let argvString = args
      .map(arg => {
        return `'${arg}'`;
      })
      .join('   ');
    let commandOrder = `NODE_ENV=${this.config.getEnv()} node ${
      appConfig.appPath
    }/dist/commands/index.js ${commandName} ${argvString}`;
    this.log(`待执行命令=> ${commandOrder}`);
    let commandStartAtFormated = moment().format(DISPLAY_BY_MILLSECOND);
    let commandStartAtms = moment().valueOf();
    shell.exec(
      commandOrder,
      {
        async: true,
        silent: false,
      },
      () => {
        let commandFinishAtFormated = moment().format(DISPLAY_BY_MILLSECOND);
        let commandFinishAtms = moment().valueOf();
        let during = (commandFinishAtms - commandStartAtms) / 1000;
        this.log(
          `命令执行完毕 => ${commandOrder}, 共用时${during}秒, 开始执行时间=> ${commandStartAtFormated}, 执行完毕时间=> ${commandFinishAtFormated}`,
        );
        this.log(`========         分隔符          ==========`);
      },
    );
  }
  /**
   * 分发日志Parse命令
   * @param {*} commandName
   * @param {*} startAt
   * @param {*} endAt
   */
  async dispatchParseCommand(commandName, startAtStr, endAtStr) {
    this.log(`${commandName}任务开始, 处理时间 => ${startAtStr}, ${endAtStr}`);
    this.execCommand(commandName, [
      startAtStr, // startAtYmdHi:
      endAtStr, // endAtYmdHi
    ]);
  }
}

export default TaskManger;

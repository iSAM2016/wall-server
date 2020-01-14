/* 任务调度系统 核心
 * @Author: isam2016
 * @Date: 2020-01-14 16:08:44
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-14 17:09:26
 */
import * as _ from 'lodash';
import * as path from 'path';
import * as moment from 'moment';
import * as shell from 'shelljs';
import * as schedule from 'node-schedule';
import CommandsBase from '../commandsBase';
import { EndParse, StartPase } from '@annotation';
import {
  COMMAND_ARGUMENT_BY_MINUTE,
  DATABASE_BY_MONTH,
} from '@commands/config';
import { Inject } from 'typescript-ioc';
import { DataCleaning } from '@commands/utils';
class TaskManger extends CommandsBase {
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
  }
  // 关闭其他进程
  async claoseOtherTaskManger() {
    let taskManagerPidList = await this.getOtherTaskMangerPidList();
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
   * 判断该条记录是不是uv记录 格式
   * @param {Object} record
   * @return {Boolean}
   */
  isLegalRecord(): boolean {
    return true;
  }
}

export default TaskManger;

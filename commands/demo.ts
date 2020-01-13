import Base from './commands/commandsBase';
import { Command } from '@adonisjs/ace';
import { CommonModuleInterface } from '@commands/interface';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';
import moment = require('moment');

class CommandDemo extends Base implements CommonModuleInterface {
  startAtMoment: moment.Moment;
  endAtMoment: moment.Moment;
  projectMap = new Map();
  static get signature() {
    return `
    Command:Demo

     {user:[必传]用户名}
     {name?:[可选]称谓}

     {--onlyFlag:[必传]flag,只有true/false两个值}
     {--logName=@value:[必传]日志文件名}
     {--isTest?=@value:[可选]是否处于测试环境}
     `;
  }

  static get description() {
    return '解析kafka日志, 分析pv';
  }
  async handle(args, options) {
    this.log('Command:Demo start');
    // throw Error('testEror');
    let { user, name } = args;
    let { onlyFlag, logName, isTest } = options;
    this.log('user =>', user);
    this.log(`CommandDemo, name=> ${name}`);
    this.log(`CommandDemo, onlyFlag=> ${onlyFlag}`);
    this.log(`CommandDemo, logName=> ${logName}`);
    this.log(`CommandDemo, isTest=> ${isTest}`);
    this.log('Command:Demo finish');
  }
  readLogSaveToCache(): boolean {
    return true;
  }
  isLegalRecord(): boolean {
    return true;
  }
}

export default CommandDemo;

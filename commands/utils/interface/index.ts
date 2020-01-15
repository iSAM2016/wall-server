import { DotenvConfigOptions } from 'dotenv';
import moment = require('moment');

export interface CommondInterface {
  new (): CommonModuleInterface;
  signature(): string;
  description(): string;
}

export interface CommonModuleInterface {
  startAtMoment: moment.Moment;
  endAtMoment: moment.Moment;
  projectMap: any;
  saveTODB(): Promise<DBResult>;
  handle(args: any, options: any): Promise<any>;
  readLogSaveToCache(record): boolean; // 将一段时间添加到缓存
  isLegalRecord(): boolean;
}

export interface DBResult {
  totalRecordCount: number;
  processRecordCount: number;
  successSaveCount: number;
}

export interface EnvConfig {
  [key: string]: any;
}
// ？ 是可选参数
// 定义对象
export interface ConfigOptions extends Partial<DotenvConfigOptions> {}

export interface ParseBaseInterface {
  isArgumentsLegal(args); // 判断 时间参数是否合法
  parseLog(startAt: number, endAt: number); // 读取日志文件
}

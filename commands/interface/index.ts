import { DotenvConfigOptions } from 'dotenv';

export interface CommondInterface {
  new (): CommonModuleInterface;
  signature(): string;
  description(): string;
}

export interface CommonModuleInterface {
  projectMap: any;
  handle(args: any, options: any): Promise<any>;
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

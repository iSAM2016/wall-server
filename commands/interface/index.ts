import { DotenvConfigOptions } from 'dotenv';

export interface CommondInterface {
  new (): CommonModuleInterface;
  signature(): string;
  description(): string;
}

export interface CommonModuleInterface {
  log(); // 打印日志
  handle(args, options);
}

export interface EnvConfig {
  [key: string]: any;
}
// ？ 是可选参数
// 定义对象
export interface ConfigOptions extends Partial<DotenvConfigOptions> {}

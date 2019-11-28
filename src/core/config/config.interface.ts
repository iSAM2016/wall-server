import { DotenvConfigOptions } from 'dotenv';

export interface EnvConfig {
  [key: string]: any;
}
// ？ 是可选参数
// 定义对象
export interface ConfigOptions extends Partial<DotenvConfigOptions> {
  replaceConfigName?: (name: string) => string;
}
// 接口定义函数validateInput
export interface EnvValidator {
  validateInput(envConfig: EnvConfig): EnvConfig;
}

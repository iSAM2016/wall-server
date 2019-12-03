import { DotenvConfigOptions } from 'dotenv';

export interface EnvConfig {
  [key: string]: {
    [key: string]: any;
  };
}
// ？ 是可选参数
// 定义对象
export interface ConfigOptions extends Partial<DotenvConfigOptions> {}

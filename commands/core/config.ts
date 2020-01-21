/* 判断config 的加载项
 * @Author: isam2016
 * @Date: 2019-12-31 12:23:17
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 15:22:22
 */

import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import { get } from 'lodash';
import { resolve } from 'path';
import { EnvConfig, ConfigOptions } from '../utils/interface';
let configMap = new Map();
const CONFIGMAPKEY = 'CONFIGMAPKEY';

export class ConfigService {
  private static envConfig: EnvConfig;
  // 文件路径
  private rootPath: string;

  constructor() {
    let config: ConfigOptions = {};
    const filePath: string = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile: string = resolve(
      __dirname,
      '../../../commands/env',
      filePath,
    );
    if (this.isFileExist(envFile)) {
      config = dotenv.parse(fs.readFileSync(envFile));
    }

    ConfigService.envConfig = this.validateInpt(config);
  }
  /**
   *  检测文件是否存在
   * @param startPath
   */
  private isFileExist(filePath: string): boolean {
    if (!fs.existsSync(filePath)) {
      throw Error('配置文件' + filePath + '不存在');
    }
    return true;
  }
  /**
   * 校验env 文件
   * @private
   * @memberof ConfigService
   */
  private validateInpt(envConfig: ConfigOptions): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      SYSTEM_SECRET: Joi.string().required(),
      MYSQL_PORT: Joi.number().required(),
      MYSQL_HOST: Joi.string().required(),
      MYSQL_USERNAME: Joi.string().required(),
      MYSQL_PASSWORD: Joi.string().required(),
      MYSQL_DATABASE: Joi.string().required(),
      MYSQL_SYNCHRONIZE: Joi.bool().required(),
      REDIS_HOST: Joi.string().required(),
      REDIS_PORT: Joi.string().required(),
      REDIS_DB: Joi.string().required(),
      MAIL_HOST: Joi.string().required(),
      MAIL_PORT: Joi.number().required(),
      APP_PORT: Joi.number().required(),
      NODE_VERSION: Joi.number().required(),
      MYSQL_VERSION: Joi.number().required(),
      MAXAGE_MS: Joi.number().required(),
      MAIL_USER: Joi.string().required(),
      MAIL_PASS: Joi.string().required(),
      ALERT_WATCH_UCID_LIST: Joi.string().required(),
      ALERT_MAX_CONTENT_CHAR: Joi.number().required(),
      ALERT_IS_USEING: Joi.boolean().required(),
      ALERT_WXADDR: Joi.string().required(),
      NGINXLOG_FILEPATH: Joi.string().required(),
    });
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      console.log(`
      ==========================================
      文件加载错误 error: ${error.message}
      =========================================`);
      return {};
    }
    return validatedEnvConfig;
  }
  /**
   * 获取问价配置
   * @param key
   * @param defaultVal
   */
  static get(key: string, defaultValue?: ''): string | number {
    const configValue = get(ConfigService.envConfig, key);
    return process.env[key] || configValue || defaultValue;
  }
  /**
   * 获取配置
   * @param key
   * @param defaultVal
   */
  get(key: string, defaultVal?: any): string | number {
    return process.env[key] || ConfigService.envConfig[key] || defaultVal;
  }

  /** 开发模式 */
  static get isDevelopment(): boolean {
    return ConfigService.get('NODE_ENV') === 'development';
  }
  /** 开发模式 */
  get isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }
  /** 生产模式 */
  static get isProduction(): boolean {
    return ConfigService.get('NODE_ENV') === 'production';
  }
  /** 生产模式 */
  get isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }
  /** 测试模式 */
  static get isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }
  /** 测试模式 */
  get isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }
  getEnv(): string {
    return process.env['NODE_ENV'] || 'development';
  }
}
export const getConfig = (): ConfigService => {
  if (configMap.has(CONFIGMAPKEY)) {
    return configMap.get(CONFIGMAPKEY);
  }
  let config = new ConfigService();
  configMap.set(CONFIGMAPKEY, config);
  return config;
};

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import { Injectable, Inject } from '@nestjs/common';
import { isAbsolute, resolve, dirname } from 'path';
import { get } from 'lodash';
// // 缺少环境变量的名称和类型（无智能感知）
// // 缺少提供对 .env 文件的验证
// // env文件将布尔值/作为string ('true'),提供，因此每次都必须将它们转换为 boolean
import { EnvConfig, ConfigOptions } from './config.interface';
import { CONFIG_OPTIONS } from './constants';

@Injectable()
export class ConfigService {
  private static envConfig: EnvConfig;
  // 文件路径
  private rootPath: string;

  constructor(@Inject(CONFIG_OPTIONS) private options) {
    let config: ConfigOptions;
    const filePath: string = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile: string = resolve(
      __dirname,
      '../../',
      options.folder,
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
      throw Error('文件不存在');
    }
    return true;
  }
  private resolveRootPath(startPath: string) {
    if (!isAbsolute(startPath)) {
      throw Error('filePath must be an absolute path');
    }
    // if(){}
    if (!this.rootPath) {
      const root = this.root();
      let workingDir = startPath;
      let parent = dirname(startPath);
      while (workingDir !== root && parent !== root && parent !== workingDir) {
        workingDir = parent;
        parent = dirname(workingDir);
      }
      this.rootPath = workingDir;
    }
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

      // API_AUTH_ENABLED: Joi.boolean().required(),
    });
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
  /**
   * 获取根路径
   * @param dir
   */
  private root(dir: string = ''): string {
    const rootPath = this.rootPath || resolve(process.cwd());
    return resolve(rootPath, dir);
  }
  /**
   * 获取问价配置
   * @param key
   * @param defaultVal
   */
  static get(key: string | string[], defaultValue?: any): string | number {
    const configValue = get(ConfigService.envConfig, key);
    if (configValue === undefined) {
      return defaultValue;
    }
    return configValue;
  }
  /**
   * 获取配置
   * @param key
   * @param defaultVal
   */
  get(key: string, defaultVal?: any): string {
    return process.env[key] || ConfigService.envConfig[key] || defaultVal;
  }
  /**
   * 获取系统配置
   * @param keys
   */
  getKeys(keys: string[]): any {
    return keys.reduce((obj, key: string) => {
      obj[key] = this.get[key];
      return obj;
    }, {});
  }

  /**
   * 获取字典对象和数组
   * @param key
   */
  getJson(key: string): { [prop: string]: any } {
    try {
      return JSON.parse(this.get(key));
    } catch (error) {
      return null;
    }
  }
  /**
   * 检查一个key是否存在
   * @param key
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }
  /** 开发模式 */
  get isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }
  /** 生产模式 */
  get isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }
  /** 测试模式 */
  get isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }
}

// /* 判断config 的加载项
//  * @Author: isam2016
//  * @Date: 2019-12-31 12:23:17
//  * @Last Modified by: isam2016
//  * @Last Modified time: 2019-12-31 12:37:57
//  */

// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// import * as Joi from '@hapi/joi';
// import { resolve } from 'path';
// import { get } from 'lodash';
// import { EnvConfig, ConfigOptions } from '../interface';

// class ConfigService {
//   private static envConfig: EnvConfig;
//   // 文件路径
//   private rootPath: string;

//   //TODO: optiisn
//   constructor(private options) {
//     let config: ConfigOptions;
//     const filePath: string = `${process.env.NODE_ENV || 'development'}.env`;
//     const envFile: string = resolve(
//       __dirname,
//       '../../',
//       options.folder,
//       filePath,
//     );
//     if (this.isFileExist(envFile)) {
//       config = dotenv.parse(fs.readFileSync(envFile));
//     }
//     ConfigService.envConfig = this.validateInpt(config);
//   }
//   /**
//    *  检测文件是否存在
//    * @param startPath
//    */
//   private isFileExist(filePath: string): boolean {
//     if (!fs.existsSync(filePath)) {
//       throw Error('文件不存在');
//     }
//     return true;
//   }
//   /**
//    * 校验env 文件
//    * @private
//    * @memberof ConfigService
//    */
//   private validateInpt(envConfig: ConfigOptions): EnvConfig {
//     const envVarsSchema: Joi.ObjectSchema = Joi.object({
//       SYSTEM_SECRET: Joi.string().required(),
//       MYSQL_PORT: Joi.number().required(),
//       MYSQL_HOST: Joi.string().required(),
//       MYSQL_USERNAME: Joi.string().required(),
//       MYSQL_PASSWORD: Joi.string().required(),
//       MYSQL_DATABASE: Joi.string().required(),
//       MYSQL_SYNCHRONIZE: Joi.bool().required(),
//       REDIS_HOST: Joi.string().required(),
//       REDIS_PORT: Joi.string().required(),
//       REDIS_DB: Joi.string().required(),
//       MAIL_HOST: Joi.string().required(),
//       MAIL_PORT: Joi.number().required(),
//       APP_PORT: Joi.number().required(),
//       NODE_VERSION: Joi.number().required(),
//       MYSQL_VERSION: Joi.number().required(),
//       MAXAGE_MS: Joi.number().required(),
//       MAIL_USER: Joi.string().required(),
//       MAIL_PASS: Joi.string().required(),

//       // API_AUTH_ENABLED: Joi.boolean().required(),
//     });
//     const { error, value: validatedEnvConfig } = envVarsSchema.validate(
//       envConfig,
//     );
//     if (error) {
//       throw new Error(`Config validation error: ${error.message}`);
//     }
//     return validatedEnvConfig;
//   }
//   /**
//    * 获取问价配置
//    * @param key
//    * @param defaultVal
//    */
//   static get(key: string | string[], defaultValue?: any): string | number {
//     const configValue = get(ConfigService.envConfig, key);
//     if (configValue === undefined) {
//       return defaultValue;
//     }
//     return configValue;
//   }
//   /**
//    * 获取配置
//    * @param key
//    * @param defaultVal
//    */
//   get(key: string, defaultVal?: any): string {
//     return process.env[key] || ConfigService.envConfig[key] || defaultVal;
//   }

//   /** 开发模式 */
//   get isDevelopment(): boolean {
//     return this.get('NODE_ENV') === 'development';
//   }
//   /** 生产模式 */
//   get isProduction(): boolean {
//     return this.get('NODE_ENV') === 'production';
//   }
//   /** 测试模式 */
//   get isTest(): boolean {
//     return this.get('NODE_ENV') === 'test';
//   }
// }

// let configCacheMap = new Map();
// function getConfig() {
//   if (configCacheMap.has(loggerConfigJSON)) {
//     return loggerCacheMap.get(loggerConfigJSON);
//   } else {
//     log4js.configure(loggerConfig);
//     let logger = log4js.getLogger(loggerType);
//     loggerCacheMap.set(loggerConfigJSON, logger);
//     return logger;
//   }
// }

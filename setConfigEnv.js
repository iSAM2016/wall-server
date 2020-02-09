const fs = require('fs');
const Joi = require('@hapi/joi');
const dotenv = require('dotenv');
const lodash_1 = require('lodash');
const path_1 = require('path');
var shell = require('shelljs');
let configMap = new Map();
let { NODE_ENV } = process.env;

let envfileName = ['test', 'development', 'build'];

class ConfigService {
  constructor() {
    let config = {};
    for (let name of envfileName) {
      const envFile = path_1.resolve(__dirname, './env/', name + '.env');
      if (this.isFileExist(envFile)) {
        config = dotenv.parse(fs.readFileSync(envFile));
      }
      let envConfig = this.validateInpt(config);
      configMap.set(name, envConfig);
    }
    this.setEnv();
  }
  isFileExist(filePath) {
    if (!fs.existsSync(filePath)) {
      throw Error('配置文件' + filePath + '不存在');
    }
    return true;
  }
  validateInpt(envConfig) {
    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string().required(),
      SYSTEM_SECRET: Joi.string().required(),
      MYSQL_PORT: Joi.number().required(),
      MYSQL_USER: Joi.string().required(),
      MYSQL_PASSWORD: Joi.string().required(),
      MYSQL_ROOT_PASSWORD: Joi.string().required(),
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
    });
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`
      ==========================================
      文件加载错误 error: ${error.message}
      =========================================`);
    }
    return validatedEnvConfig;
  }
  setEnv() {
    if (!NODE_ENV) {
      return false;
    }
    let currentEng = configMap.get(NODE_ENV);
    Object.keys(currentEng).forEach(_ => {
      console.log(currentEng[_]);
      shell.env[_] = currentEng[_];
    });
  }
}
let config = new ConfigService();

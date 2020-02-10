"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Joi = require("@hapi/joi");
const dotenv = require("dotenv");
const lodash_1 = require("lodash");
const path_1 = require("path");
let configMap = new Map();
const CONFIGMAPKEY = 'CONFIGMAPKEY';
class ConfigService {
    constructor() {
        let config = {};
        const envFile = path_1.resolve(__dirname, '../../../.env');
        if (this.isFileExist(envFile)) {
            config = dotenv.parse(fs.readFileSync(envFile));
            ConfigService.envConfig = config;
        }
    }
    isFileExist(filePath) {
        if (!fs.existsSync(filePath)) {
            return false;
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
        const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
        if (error) {
            console.log(`
      ==========================================
      文件加载错误 error: ${error.message}
      =========================================`);
            return {};
        }
        return validatedEnvConfig;
    }
    static get(key, defaultValue) {
        const configValue = lodash_1.get(ConfigService.envConfig, key);
        return process.env[key] || configValue || defaultValue;
    }
    get(key, defaultVal) {
        return process.env[key] || ConfigService.envConfig[key] || defaultVal;
    }
    static get isDevelopment() {
        return ConfigService.get('NODE_ENV') === 'development';
    }
    get isDevelopment() {
        return this.get('NODE_ENV') === 'development';
    }
    static get isProduction() {
        return ConfigService.get('NODE_ENV') === 'production';
    }
    get isProduction() {
        return this.get('NODE_ENV') === 'production';
    }
    static get isTest() {
        return this.get('NODE_ENV') === 'test';
    }
    get isTest() {
        return this.get('NODE_ENV') === 'test';
    }
    getEnv() {
        return process.env['NODE_ENV'] || 'development';
    }
}
exports.ConfigService = ConfigService;
exports.getConfig = () => {
    if (configMap.has(CONFIGMAPKEY)) {
        return configMap.get(CONFIGMAPKEY);
    }
    let config = new ConfigService();
    configMap.set(CONFIGMAPKEY, config);
    return config;
};

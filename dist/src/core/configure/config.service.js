"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require("fs");
const Joi = require("@hapi/joi");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const lodash_1 = require("lodash");
const constants_1 = require("./constants");
let ConfigService = ConfigService_1 = class ConfigService {
    constructor(options) {
        this.options = options;
        let config;
        const filePath = `.env`;
        const envFile = path_1.resolve(__dirname, '../', options.folder, filePath);
        if (this.isFileExist(envFile)) {
            config = dotenv.parse(fs.readFileSync(envFile));
        }
        ConfigService_1.envConfig = this.validateInpt(config);
    }
    isFileExist(filePath) {
        if (!fs.existsSync(filePath)) {
            throw Error('文件不存在');
        }
        return true;
    }
    validateInpt(envConfig) {
        const envVarsSchema = Joi.object({
            SYSTEM_SECRET: Joi.string().required(),
            MYSQL_PORT: Joi.number().required(),
            MYSQL_DB_HOST: Joi.string().required(),
            NODE_ENV: Joi.string().required(),
            MYSQL_ROOT_PASSWORD: Joi.string().required(),
            MYSQL_USER: Joi.string().required(),
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
        });
        const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }
    static get(key, defaultValue) {
        const configValue = lodash_1.get(ConfigService_1.envConfig, key);
        return process.env[key] || configValue[key];
        if (configValue === undefined) {
            return defaultValue;
        }
        return configValue;
    }
    get(key, defaultVal) {
        return process.env[key] || ConfigService_1.envConfig[key] || defaultVal;
    }
    getKeys(keys) {
        return keys.reduce((obj, key) => {
            obj[key] = this.get[key];
            return obj;
        }, {});
    }
    getJson(key) {
        try {
            return JSON.parse(this.get(key));
        }
        catch (error) {
            return null;
        }
    }
    has(key) {
        return this.get(key) !== undefined;
    }
    static get isDevelopment() {
        return this.get('NODE_ENV') === 'development';
    }
    get isDevelopment() {
        return this.get('NODE_ENV') === 'development';
    }
    static get isProduction() {
        return this.get('NODE_ENV') === 'prod';
    }
    get isProduction() {
        return this.get('NODE_ENV') === 'prod';
    }
};
ConfigService = ConfigService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(constants_1.CONFIG_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], ConfigService);
exports.ConfigService = ConfigService;

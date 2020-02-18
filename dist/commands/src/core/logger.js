"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
const moment = require("moment");
const lodash_1 = require("lodash");
const date_format_1 = require("../config/date_format");
var path = require('path');
let ABSOLUTE_LOG_PATH = path.resolve(__dirname, '../../', 'log');
class Logger {
    constructor(options) {
        this.options = options;
        this.loggerCacheMap = new Map();
        this.getLogger = (loggerType = 'express', loggerConfig) => {
            let loggerConfigJSON = JSON.stringify({ loggerType, loggerConfig });
            if (this.loggerCacheMap.has(loggerConfigJSON)) {
                return this.loggerCacheMap.get(loggerConfigJSON);
            }
            else {
                log4js.configure(loggerConfig);
                let logger = log4js.getLogger(loggerType);
                this.loggerCacheMap.set(loggerConfigJSON, logger);
                return logger;
            }
        };
        this.info = (...arg) => {
            let message = '';
            arg.forEach(rawMessage => {
                if (lodash_1.default.isString(rawMessage) === false) {
                    message = message + JSON.stringify(rawMessage);
                }
                else {
                    message = message + rawMessage;
                }
            });
            let triggerAt = moment().format(date_format_1.DISPLAY_BY_MILLSECOND);
            console.log(`[${triggerAt}]-[runtime] ` + message);
            this.getExpressLogger().info(message);
        };
        this.warn = (...arg) => {
            let message = '';
            arg.forEach(rawMessage => {
                if (lodash_1.default.isString(rawMessage) === false) {
                    message = message + JSON.stringify(rawMessage);
                }
                else {
                    message = message + rawMessage;
                }
            });
            let triggerAt = moment().format(date_format_1.DISPLAY_BY_MILLSECOND);
            console.warn(`[${triggerAt}]-[runtime] ` +
                message +
                ` => ${this.getStackInfoString()}`);
            this.getExpressLogger().warn(message + ` => ${this.getStackInfoString()}`);
        };
        this.error = (...arg) => {
            let message = '';
            arg.forEach(rawMessage => {
                if (lodash_1.default.isString(rawMessage) === false) {
                    message = message + JSON.stringify(rawMessage);
                }
                else {
                    message = message + rawMessage;
                }
            });
            let triggerAt = moment().format(date_format_1.DISPLAY_BY_MILLSECOND);
            console.error(`[${triggerAt}]-[runtime] ` +
                message +
                ` => ${this.getStackInfoString()}`);
            this.getExpressLogger().error(message + ` => ${this.getStackInfoString()}`);
        };
        this.getLogger4Command = (commandName = 'unsetCommandName') => {
            let loggerConfig = {
                appenders: {
                    command: {
                        type: 'dateFile',
                        filename: `${ABSOLUTE_LOG_PATH}/command/${'runtime'}`,
                        pattern: '-yyyy-MM-dd.log',
                        alwaysIncludePattern: true,
                    },
                    express: {
                        type: 'dateFile',
                        filename: `${ABSOLUTE_LOG_PATH}/express/runtime`,
                        pattern: '-yyyy-MM-dd.log',
                        alwaysIncludePattern: true,
                    },
                },
                categories: {
                    default: { appenders: ['express'], level: 'info' },
                    command: { appenders: ['command'], level: 'info' },
                    express: { appenders: ['express'], level: 'info' },
                },
            };
            return this.getLogger(`command`, loggerConfig);
        };
        this.getStackInfoString = () => {
            let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
            let stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
            let stacklist = new Error().stack.split('\n').slice(3);
            let s = stacklist[0];
            let sp = stackReg.exec(s) || stackReg2.exec(s);
            let data = {};
            if (sp && sp.length === 5) {
                data.method = sp[1];
                data.path = sp[2];
                data.line = sp[3];
                data.pos = sp[4];
                data.file = path.basename(data.path);
            }
            return JSON.stringify(data);
        };
        this.baseLoggerConfig = {
            appenders: {
                express: {
                    type: 'dateFile',
                    filename: `${ABSOLUTE_LOG_PATH}/express/runtime`,
                    pattern: '-yyyy-MM-dd.log',
                    alwaysIncludePattern: true,
                },
            },
            categories: {
                default: { appenders: ['express'], level: 'info' },
                express: { appenders: ['express'], level: 'info' },
            },
        };
    }
    getExpressLogger() {
        return this.getLogger('express', this.baseLoggerConfig);
    }
}
exports.Logger = Logger;

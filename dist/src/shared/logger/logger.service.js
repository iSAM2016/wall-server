"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
class LoggerService {
    constructor() {
        const format = this.isProductionEnv()
            ? winston.format.combine(winston.format.timestamp(), winston.format.json())
            : winston.format.combine(winston.format.colorize(), winston.format.simple());
        this.instance = winston.createLogger({
            level: 'info',
            silent: this.isTestEnv(),
            format,
            transports: [
                new winston.transports.Console({
                    stderrLevels: ['error'],
                }),
            ],
        });
    }
    info(message) {
        this.instance.info(message);
    }
    error(message) {
        this.instance.error(message);
    }
    isTestEnv() {
        return process.env.NODE_ENV === 'test';
    }
    isProductionEnv() {
        return (process.env.NODE_ENV === 'production' ||
            process.env.NODE_ENV === 'staging');
    }
}
exports.LoggerService = LoggerService;

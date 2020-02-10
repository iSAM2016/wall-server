"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
let appPath = path.resolve(__dirname, '../../');
const appConfig = {
    name: '监控平台开发环境' || '',
    appPath,
    absoluteLogPath: path.resolve(appPath, 'log'),
};
exports.appConfig = appConfig;

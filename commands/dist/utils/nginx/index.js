"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const moment = require("moment");
const config_1 = require("../../config");
let logPath = config_1.appConfig.absoluteLogPath;
const YMFormat = 'YYYYMM';
const DDFormat = 'DD';
const HHFormat = 'HH';
const mmFormat = 'mm';
const LOG_TYPE_RAW = 'raw';
exports.LOG_TYPE_RAW = LOG_TYPE_RAW;
const LOG_TYPE_JSON = 'json';
exports.LOG_TYPE_JSON = LOG_TYPE_JSON;
const LOG_TYPE_TEST = 'test';
exports.LOG_TYPE_TEST = LOG_TYPE_TEST;
function getAbsoluteBasePathByType(logType = LOG_TYPE_RAW) {
    switch (logType) {
        case LOG_TYPE_RAW:
            break;
        case LOG_TYPE_JSON:
            break;
        case LOG_TYPE_TEST:
            break;
        default:
            logType = LOG_TYPE_RAW;
    }
    let fileUri = path.resolve(logPath, 'nginx', logType);
    return fileUri;
}
exports.getAbsoluteBasePathByType = getAbsoluteBasePathByType;
function getAbsoluteLogUriByType(logAt, logType = LOG_TYPE_RAW) {
    switch (logType) {
        case LOG_TYPE_RAW:
            break;
        case LOG_TYPE_JSON:
            break;
        case LOG_TYPE_TEST:
            break;
        default:
            logType = LOG_TYPE_RAW;
    }
    let startAtMoment = moment.unix(logAt);
    let basePath = getAbsoluteBasePathByType(logType);
    let monthDirName = getMonthDirName(logAt);
    let fileName = `./${monthDirName}/day_${startAtMoment.format(DDFormat)}/${startAtMoment.format(HHFormat)}/${startAtMoment.format(mmFormat)}.log`;
    let fileUri = path.resolve(basePath, fileName);
    return fileUri;
}
exports.getAbsoluteLogUriByType = getAbsoluteLogUriByType;
function getMonthDirName(logAt) {
    let startAtMoment = moment.unix(logAt);
    let monthDirName = `month_${startAtMoment.format(YMFormat)}`;
    return monthDirName;
}
exports.getMonthDirName = getMonthDirName;

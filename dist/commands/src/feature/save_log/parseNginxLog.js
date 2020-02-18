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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const md5 = require("md5");
const _ = require("lodash");
const path = require("path");
const moment = require("moment");
const queryString = require("query-string");
const shell = require("shelljs");
const parser = require("ua-parser-js");
const typescript_ioc_1 = require("typescript-ioc");
const commandsBase_1 = require("../commandsBase");
const lei_stream_1 = require("lei-stream");
const shard_1 = require("../../shard");
const utils_1 = require("../../utils");
const config_1 = require("../../config");
const TEST_LOG_FLAG = 'b47ca710747e96f1c523ebab8022c19e9abaa56b';
let jsonWriteStreamPool = new Map();
let rawLogWriteStreamPool = new Map();
class NginxParse extends commandsBase_1.default {
    constructor() {
        super();
    }
    static get signature() {
        return `
     SaveLog:Nginx
     `;
    }
    static get description() {
        return '每一分钟读取Nginx日志文件，并解析';
    }
    async handle(...arg) {
        try {
            let that = this;
            let projectMap = await this.projectService.getList();
            let logCounter = 0;
            let legalLogCounter = 0;
            let nginxLogFilePath = config_1.appConfig.absoluteLogPath + '/nginx';
            let timeAt = moment().unix() - 60;
            let timeMoment = moment.unix(timeAt);
            let formatStr = timeMoment.format('/YYYYMM/DD/HH/mm');
            let logAbsolutePath = '';
            if (this.config.getEnv() === 'test') {
                logAbsolutePath = `${nginxLogFilePath}${'test'}.log`;
            }
            else {
                logAbsolutePath = `${nginxLogFilePath}${formatStr}.log`;
            }
            if (fs.existsSync(logAbsolutePath) === false) {
                that.log(`log文件不存在, 自动跳过 => ${logAbsolutePath}`);
                return false;
            }
            that.log(`开始读取文件 => ${logAbsolutePath}`);
            let onDataIn = async (data, next) => {
                logCounter++;
                let content = data.toString();
                let logCreateAt = this.parseLogCreateAt(content);
                if (_.isFinite(logCreateAt) === false || logCreateAt <= 0) {
                    this.log('日志时间不合法, 自动跳过');
                    return;
                }
                let parseResult = await that.parseLog(content, projectMap);
                if (_.isEmpty(parseResult)) {
                    that.log('日志格式不规范, 自动跳过, 原日志内容为 =>', content);
                    return false;
                }
                let projectName = _.get(parseResult, ['project_name'], 0);
                let projectRate = _.get(projectMap, [projectName, 'rate'], 100);
                let checkFlag = _.floor(logCounter % 10000);
                let skipIt = checkFlag > projectRate;
                legalLogCounter = legalLogCounter + 1;
                let rawLogWriteStreamByLogCreateAt = this.getWriteStreamClientByType(logCreateAt, utils_1.LOG_TYPE_RAW);
                rawLogWriteStreamByLogCreateAt.write(content);
                this.log(`收到数据, 当前共记录${legalLogCounter}/${logCounter}条数据`);
                let jsonWriteStreamByLogCreateAt = this.getWriteStreamClientByType(logCreateAt, utils_1.LOG_TYPE_JSON);
                jsonWriteStreamByLogCreateAt.write(JSON.stringify(parseResult));
                if (jsonWriteStreamPool.size > 2 || rawLogWriteStreamPool.size > 2) {
                    this.autoCloseOldStream();
                }
                next();
            };
            lei_stream_1.readLine(fs.createReadStream(logAbsolutePath), {
                newline: '\n',
                autoNext: false,
                toString: true,
                encoding: null,
            }).go(onDataIn, function () {
            });
        }
        catch (error) {
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
            this.log(this.constructor.name + '运行异常 =>' + error.message);
        }
    }
    parseLogCreateAt(data) {
        return 1;
    }
    async getProjectMap() { }
    isTestLog(content) {
        return content.includes(TEST_LOG_FLAG);
    }
    async parseLog(data, projectMap) {
        const info = data.split(' ');
        let url = _.get(info, [5], '');
        const urlQS = queryString.parseUrl(url);
        let record = _.get(urlQS, ['query', 'd'], '[]');
        try {
            record = JSON.parse(record);
        }
        catch (err) {
            this.log('==== 打点数据异常 ====', err);
            return null;
        }
        record.md5 = md5(data);
        if (_.has(record, ['pub'])) {
            record.common = record.pub;
        }
        if (_.isEmpty(record)) {
            this.log('record 不规范 =>', record);
            return null;
        }
        if (_.has(record, ['key']) === false) {
            this.log('key 不存在 =>', record);
            return null;
        }
        if (record.key === '') {
            this.log('记录中没有record.key  =>', record.key);
            return null;
        }
        if (_.has(projectMap, [record.key]) === false) {
            this.log(`项目尚未注册projectMap[${record.key}] =>`, projectMap, record.key);
            return null;
        }
        record.project_id = projectMap[record.key]['id'];
        let currentAt = moment().unix();
        let logCreateAt = this.parseLogCreateAt(data);
        if (Math.abs(logCreateAt - currentAt) > 864000) {
            this.log('入库时间超出阈值, 自动跳过 finialTimeAt=>', logCreateAt);
            return null;
        }
        record.time = logCreateAt;
        let safeInfo17 = _.replace(info[17], '%', '');
        record.ua = parser(decodeURIComponent(safeInfo17));
        let browserVersion = _.get(record.ua, ['browser', 'version'], '');
        if (browserVersion === 'chromium_ver') {
            _.set(record.ua, ['browser', 'version'], '50.0.2661.102');
            _.set(record.ua, ['browser', 'major'], '50');
        }
        record.ip = info[0] || info[1];
        const location = await utils_1.ip2Locate(record.ip);
        record.country = location.country;
        record.province = location.province;
        record.city = location.city;
        return record;
    }
    getWriteStreamClientByType(nowAt, logType = utils_1.LOG_TYPE_RAW) {
        switch (logType) {
            case utils_1.LOG_TYPE_RAW:
                break;
            case utils_1.LOG_TYPE_JSON:
                break;
            case utils_1.LOG_TYPE_TEST:
                break;
            default:
                logType = utils_1.LOG_TYPE_RAW;
        }
        let nowAtLogUri = utils_1.getAbsoluteLogUriByType(nowAt, logType);
        let logPath = path.dirname(nowAtLogUri);
        this.log('创建存储目录 =>', logPath);
        shell.mkdir('-p', logPath);
        let nowAtWriteStream = null;
        if (jsonWriteStreamPool.has(nowAtLogUri)) {
            nowAtWriteStream = jsonWriteStreamPool.get(nowAtLogUri);
        }
        else {
            nowAtWriteStream = lei_stream_1.writeLine(fs.createWriteStream(nowAtLogUri, { flags: 'a' }), {
                newline: '\n',
                encoding: null,
                cacheLines: 0,
            });
            jsonWriteStreamPool.set(nowAtLogUri, nowAtWriteStream);
        }
        return nowAtWriteStream;
    }
    autoCloseOldStream(isCloseAll = false) {
        let nowAt = moment().unix();
        let startAt = nowAt - 60 * 100;
        let finishAt = nowAt - 60 * 100;
        let survivalSet = new Set();
        for (let survivalAt = startAt; survivalAt < finishAt; survivalAt = survivalAt + 1) {
            let survivalAtLogUri = utils_1.getAbsoluteLogUriByType(nowAt, utils_1.LOG_TYPE_JSON);
            let survivalAtRawLogUri = utils_1.getAbsoluteLogUriByType(nowAt, utils_1.LOG_TYPE_RAW);
            if (isCloseAll === false) {
                survivalSet.add(survivalAtLogUri);
                survivalSet.add(survivalAtRawLogUri);
            }
        }
        let needCloseLogUriSet = new Set();
        for (let testLogFileUri of jsonWriteStreamPool.keys()) {
            if (survivalSet.has(testLogFileUri) === false) {
                needCloseLogUriSet.add(testLogFileUri);
            }
        }
        for (let closeLogUri of needCloseLogUriSet) {
            let needCloseStream = jsonWriteStreamPool.get(closeLogUri);
            jsonWriteStreamPool.delete(closeLogUri);
            needCloseStream.end();
        }
        needCloseLogUriSet.clear();
        for (let testLogFileUri of rawLogWriteStreamPool.keys()) {
            if (survivalSet.has(testLogFileUri) === false) {
                needCloseLogUriSet.add(testLogFileUri);
            }
        }
        for (let closeLogUri of needCloseLogUriSet) {
            let needCloseStream = rawLogWriteStreamPool.get(closeLogUri);
            rawLogWriteStreamPool.delete(closeLogUri);
            needCloseStream.end();
        }
        return true;
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", shard_1.ProjectService)
], NginxParse.prototype, "projectService", void 0);
exports.default = NginxParse;

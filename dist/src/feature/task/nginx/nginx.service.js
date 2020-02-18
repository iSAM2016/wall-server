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
var NginxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const md5 = require("md5");
const _ = require("lodash");
const path = require("path");
const moment = require("moment");
const queryString = require("query-string");
const shell = require("shelljs");
const parser = require("ua-parser-js");
const _entity_1 = require("../../../entity");
const typeorm_1 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const app_1 = require("../../../../config/app");
const lei_stream_1 = require("lei-stream");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const config_service_1 = require("../../../core/configure/config.service");
const utils_1 = require("../../../utils");
let jsonWriteStreamPool = new Map();
let rawLogWriteStreamPool = new Map();
let NginxService = NginxService_1 = class NginxService {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
        this.logger = new common_1.Logger(NginxService_1.name);
        this.projectMap = {};
        this.logCounter = 0;
        this.legalLogCounter = 0;
        this.onDataIn = async (data, next) => {
            this.logCounter++;
            let content = data.toString();
            let logCreateAt = this.parseLogCreateAt(content);
            if (_.isFinite(logCreateAt) === false || logCreateAt <= 0) {
                this.logger.log('日志时间不合法, 自动跳过');
                return;
            }
            let parseResult = await this.parseLog(content, this.projectMap);
            if (_.isEmpty(parseResult)) {
                this.logger.log('日志格式不规范, 自动跳过, 原日志内容为 =>', content);
                return false;
            }
            let projectName = _.get(parseResult, ['project_name'], 0);
            let projectRate = _.get(this.projectMap, [projectName, 'rate'], 100);
            let checkFlag = _.floor(this.logCounter % 10000);
            let skipIt = checkFlag > projectRate;
            this.legalLogCounter = this.legalLogCounter + 1;
            let rawLogWriteStreamByLogCreateAt = this.getWriteStreamClientByType(logCreateAt, utils_1.LOG_TYPE_RAW);
            rawLogWriteStreamByLogCreateAt.write(content);
            this.logger.log(`收到数据, 当前共记录${this.legalLogCounter}/${this.logCounter}条数据`);
            let jsonWriteStreamByLogCreateAt = this.getWriteStreamClientByType(logCreateAt, utils_1.LOG_TYPE_JSON);
            jsonWriteStreamByLogCreateAt.write(JSON.stringify(parseResult));
            if (jsonWriteStreamPool.size > 2 || rawLogWriteStreamPool.size > 2) {
                this.autoCloseOldStream();
            }
            next();
        };
    }
    registerTaskRepeatPer1Minute() {
        this.logger.log('registerTaskRepeatPer1Minute 开始执行');
        this.logger.log(`[按分钟] 每分钟启动一次SaveLog `);
        this.logger.log(`[按分钟] 每分钟启动一次Watch:Alarm, 监控平台运行情况 `);
        this.logger.log('registerTaskRepeatPer_1_Minute 命令分配完毕');
    }
    async nginxSaveLog() {
        this.projectMap = await this.getList();
        this.logCounter = 0;
        this.legalLogCounter = 0;
        let nginxLogFilePath = app_1.default.absoluteLogPath + '/nginx';
        let timeAt = moment().unix() - 120;
        let timeMoment = moment.unix(timeAt);
        let formatStr = timeMoment.format('/YYYYMM/DD/HH/mm');
        let logAbsolutePath = '';
        this.logger.log(`is devekopment ${config_service_1.ConfigService.isDevelopment}`);
        if (config_service_1.ConfigService.isDevelopment) {
            logAbsolutePath = `${nginxLogFilePath}${'test'}.log`;
        }
        else {
            logAbsolutePath = `${nginxLogFilePath}${formatStr}.log`;
        }
        if (fs.existsSync(logAbsolutePath) === false) {
            this.logger.log(`log文件不存在, 自动跳过 => ${logAbsolutePath}`);
            return false;
        }
        this.logger.log(`开始读取文件 => ${logAbsolutePath}`);
        lei_stream_1.readLine(fs.createReadStream(logAbsolutePath), {
            newline: '\n',
            autoNext: false,
            toString: true,
            encoding: null,
        }).go(this.onDataIn, function () {
        });
    }
    parseLogCreateAt(data) {
        let nowAt = moment().unix();
        if (_.isString(data) === false) {
            return nowAt;
        }
        const info = data.split(' ');
        let url = _.get(info, [5], '');
        const urlQS = queryString.parseUrl(url);
        let record = _.get(urlQS, ['query', 'd'], '[]');
        try {
            record = JSON.parse(record);
        }
        catch (err) {
            return nowAt;
        }
        if (_.has(record, ['pub'])) {
            record.common = record.pub;
        }
        let logAtMoment = moment(info[3].match(/(?!\[).*(?<!])/)[0], moment.ISO_8601);
        let logAt = 0;
        if (moment.isMoment(logAtMoment) && logAtMoment.isValid()) {
            logAt = logAtMoment.unix();
        }
        else {
            this.logger.log(`无法解析日志记录时间 => ${info[0]}, 自动跳过`);
        }
        return logAt;
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
            this.logger.log('==== 打点数据异常 ====', err);
            return null;
        }
        record.md5 = md5(data);
        if (_.has(record, ['pub'])) {
            record.common = record.pub;
        }
        if (_.isEmpty(record)) {
            this.logger.log('record 不规范 =>', record);
            return null;
        }
        if (_.has(record, ['key']) === false) {
            this.logger.log('key 不存在 =>', record);
            return null;
        }
        if (record.key === '') {
            this.logger.log('记录中没有record.key  =>', record.key);
            return null;
        }
        if (_.has(projectMap, [record.project_id]) === false) {
            this.logger.log(`项目尚未注册projectMap=>[${record.project_id}]`);
            return null;
        }
        let currentAt = moment().unix();
        let logCreateAt = this.parseLogCreateAt(data);
        if (Math.abs(logCreateAt - currentAt) > 864000) {
            this.logger.log('入库时间超出阈值, 自动跳过 finialTimeAt=>' + logCreateAt);
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
        this.logger.log('创建存储目录 =>' + logPath);
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
    async getList() {
        let projectList = await this.projectRepository
            .createQueryBuilder()
            .where({ is_delete: 0 })
            .getMany();
        let projectMap = {};
        for (let project of projectList) {
            projectMap[project.projectName] = {
                id: project.id,
                rate: project.rate,
            };
        }
        this.logger.log(`项目列表获取成功 => ${JSON.stringify(projectMap)}`);
        return projectMap;
    }
};
__decorate([
    schedule_1.Cron('0 */1 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NginxService.prototype, "nginxSaveLog", null);
NginxService = NginxService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(_entity_1.TRProject)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], NginxService);
exports.NginxService = NginxService;

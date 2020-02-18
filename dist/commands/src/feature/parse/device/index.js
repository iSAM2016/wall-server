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
const _ = require("lodash");
const moment = require("moment");
const parseBase_1 = require("../parseBase");
const utils_1 = require("../../../utils");
const config_1 = require("../../../config");
const typescript_ioc_1 = require("typescript-ioc");
const core_1 = require("../../../core");
const device_service_1 = require("./device.service");
class ParseDevice extends parseBase_1.default {
    constructor() {
        super();
        this.projectMap = new Map();
    }
    static get signature() {
        return `
      Parse:Device
      {startAtYmdHi:日志扫描范围上限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
      {endAtYmdHi:日志扫描范围下限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
    `;
    }
    static get description() {
        return '[按天] 解析nginx日志, 分析指定时间范围Device';
    }
    async handle(...arg) {
        try {
            await this.readLog(this.startAtMoment, this.endAtMoment, this.isLegalRecord, this.readLogSaveToCache);
            await this.saveTODB();
        }
        catch (error) {
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
            this.log(this.constructor.name + '运行异常 =>' + error.message);
        }
    }
    readLogSaveToCache(record) {
        let commonInfo = _.get(record, ['common'], {});
        let ua = _.get(record, ['ua'], {});
        let uuid = _.get(commonInfo, ['uuid'], '');
        let visitAt = _.get(record, ['time'], 0);
        let projectId = _.get(record, ['project_id'], 0);
        let country = _.get(record, ['country'], '');
        let province = _.get(record, ['province'], '');
        let city = _.get(record, ['city'], '');
        let browser = _.get(ua, ['browser', 'name'], '');
        let browserVersion = _.get(ua, ['browser', 'version'], '');
        let engine = _.get(ua, ['engine', 'name'], '');
        let engineVersion = _.get(ua, ['engine', 'version'], '');
        let deviceVendor = _.get(ua, ['device', 'vendor'], '');
        let deviceModel = _.get(ua, ['device', 'model'], '');
        let os = _.get(ua, ['os', 'name'], '');
        let osVersion = _.get(ua, ['os', 'version'], '');
        let runtimeVersion = _.get(commonInfo, ['runtime_version'], '');
        let visitAtMonth = moment.unix(visitAt).format(config_1.DATABASE_BY_MONTH);
        let deviceRecord = {
            projectId,
            visitAt,
            uuid,
            browser,
            browserVersion,
            engine,
            engineVersion,
            deviceVendor,
            deviceModel,
            os,
            osVersion,
            country,
            province,
            city,
            runtimeVersion,
        };
        let visitAtMap = new Map();
        let deviceMap = new Map();
        if (this.projectMap.has(projectId)) {
            visitAtMap = this.projectMap.get(projectId);
            if (visitAtMap.has(visitAtMonth)) {
                deviceMap = visitAtMap.get(visitAtMonth);
            }
        }
        deviceMap.set(uuid, deviceRecord);
        visitAtMap.set(visitAtMonth, deviceMap);
        this.projectMap.set(projectId, visitAtMap);
        return true;
    }
    isLegalRecord() {
        return true;
    }
    getRecordCountInProjectMap() {
        let totalCount = 0;
        for (let [projectId, visitAtMap] of this.projectMap) {
            for (let [visitAtHour, uvMap] of visitAtMap) {
                for (let [uv, uvRecord] of uvMap) {
                    totalCount = totalCount + 1;
                }
            }
        }
        return totalCount;
    }
    async saveTODB() {
        let totalRecordCount = this.getRecordCountInProjectMap();
        let processRecordCount = 0;
        let successSaveCount = 0;
        for (let [projectId, visitAtMap] of this.projectMap) {
            for (let [visitAtMonth, deviceMap] of visitAtMap) {
                for (let [uuid, deviceRecord] of deviceMap) {
                    let { visitAt } = deviceRecord;
                    const sqlParams = {
                        uuid: uuid,
                        browser: deviceRecord.browser,
                        browser_version: deviceRecord.browserVersion,
                        engine: deviceRecord.engine,
                        engine_version: deviceRecord.engineVersion,
                        device_vendor: deviceRecord.deviceVendor,
                        device_model: deviceRecord.deviceModel,
                        os: deviceRecord.os,
                        os_version: deviceRecord.osVersion,
                        country: deviceRecord.country,
                        province: deviceRecord.province,
                        city: deviceRecord.city,
                        runtime_version: deviceRecord.runtimeVersion,
                        visit_at_month: visitAtMonth,
                        log_at: visitAt,
                    };
                    let oldListRest = await this.deviceService.getOldList(projectId, visitAtMonth, uuid);
                    let id = _.get(oldListRest, [0, 'id'], 0);
                    let updateAt = moment().unix();
                    let isSuccess = false;
                    if (id > 0) {
                        sqlParams['update_time'] = updateAt;
                        let affectRows = await this.deviceService.updataDevice(sqlParams, projectId, id);
                        isSuccess = affectRows > 0;
                    }
                    else {
                        sqlParams['create_time'] = updateAt;
                        sqlParams['update_time'] = updateAt;
                        const insertId = await this.deviceService.createDevice(sqlParams, projectId);
                        isSuccess = insertId > 0;
                    }
                    processRecordCount = processRecordCount + 1;
                    if (isSuccess) {
                        successSaveCount = successSaveCount + 1;
                    }
                    this.reportProcess(processRecordCount, successSaveCount, totalRecordCount);
                }
            }
        }
        return { totalRecordCount, processRecordCount, successSaveCount };
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", device_service_1.DeviceService)
], ParseDevice.prototype, "deviceService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", core_1.DataCleaning)
], ParseDevice.prototype, "dataCleaning", void 0);
__decorate([
    utils_1.StartPase,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParseDevice.prototype, "handle", null);
__decorate([
    utils_1.EndParse,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParseDevice.prototype, "saveTODB", null);
exports.default = ParseDevice;

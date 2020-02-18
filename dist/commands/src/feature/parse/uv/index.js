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
const typescript_ioc_1 = require("typescript-ioc");
const parseBase_1 = require("../parseBase");
const uv_service_1 = require("./uv.service");
const utils_1 = require("../../../utils");
const config_1 = require("../../../config");
class ParseUV extends parseBase_1.default {
    constructor() {
        super();
        this.projectMap = new Map();
    }
    static get signature() {
        return `
     Parse:UV 
     {startAtYmdHi:日志扫描范围上限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
    }
    static get description() {
        return '[按小时] 解析nginx日志, 分析记录指定时间范围内的uv';
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
        try {
            let uuid = _.get(record, ['uuid'], '');
            let visitAt = _.get(record, ['time'], 0);
            let projectId = _.get(record, ['project_id'], 0);
            let country = _.get(record, ['country'], '');
            let province = _.get(record, ['province'], '');
            let city = _.get(record, ['city'], '');
            let pvCount = 1;
            if (_.isNumber(visitAt) === false ||
                visitAt === 0 ||
                _.isEmpty({ uuid })) {
                this.log(`数据不合法, 自动跳过 visitAt => ${visitAt}, uuid => ${uuid}`);
                return false;
            }
            let visitAtHour = moment.unix(visitAt).format(config_1.DATABASE_BY_MINUTE);
            let uvRecord = {
                projectId,
                visitAt,
                uuid,
                country,
                province,
                city,
                pvCount,
            };
            let visitAtMap = new Map();
            let uvMap = new Map();
            if (this.projectMap.has(projectId)) {
                visitAtMap = this.projectMap.get(projectId);
                if (visitAtMap.has(visitAtHour)) {
                    uvMap = visitAtMap.get(visitAtHour);
                    if (uvMap.has(uuid)) {
                        let oldUvRecord = uvMap.get(uuid);
                        uvRecord.pvCount = oldUvRecord.pvCount + uvRecord.pvCount;
                    }
                }
            }
            uvMap.set(uuid, uvRecord);
            visitAtMap.set(visitAtHour, uvMap);
            this.projectMap.set(projectId, visitAtMap);
            return true;
        }
        catch (error) {
            this.log(this.constructor.name + '运行异常 =>' + error.message);
        }
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
        try {
            let totalRecordCount = this.getRecordCountInProjectMap();
            let processRecordCount = 0;
            let successSaveCount = 0;
            for (let [projectId, visitAtMap] of this.projectMap) {
                for (let [visitAtHour, uvMap] of visitAtMap) {
                    let visitAtInDb = moment(visitAtHour, config_1.DATABASE_BY_MINUTE).unix();
                    let existUuidSet = await this.uvService.getExistUuidSetInHour(projectId, visitAtInDb);
                    for (let [uv, uvRecord] of uvMap) {
                        let { projectId, visitAt, uuid, country, province, city, pvCount, } = uvRecord;
                        let isSuccess = false;
                        uuid = `${uuid}`;
                        if (existUuidSet.has(uuid) === false) {
                            isSuccess = await this.uvService.replaceUvRecord(projectId, uuid, visitAt, country, province, city);
                            existUuidSet.add(uuid);
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
        catch (error) {
            this.log(this.constructor.name + '运行异常 =>' + error.message);
        }
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", uv_service_1.UVService)
], ParseUV.prototype, "uvService", void 0);
__decorate([
    utils_1.StartPase,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParseUV.prototype, "handle", null);
__decorate([
    utils_1.EndParse,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParseUV.prototype, "saveTODB", null);
exports.default = ParseUV;

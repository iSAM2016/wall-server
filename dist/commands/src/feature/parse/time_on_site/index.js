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
const typescript_ioc_1 = require("typescript-ioc");
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const shard_1 = require("../../../shard");
const duration_distribution_service_1 = require("./duration_distribution.service");
const config_1 = require("../../../config");
class TimeOnSiteByHour extends parseBase_1.default {
    constructor() {
        super(...arguments);
        this.projectMap = new Map();
    }
    static get signature() {
        return `
     Parse:TimeOnSiteByHour 
     {startAtYmdHi:日志扫描范围上限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
    }
    static get description() {
        return '[按小时] 解析nginx日志, 分析记录指定时间范围内用户停留时长';
    }
    async handle(...arg) {
        try {
            await this.readLog(this.startAtMoment, this.endAtMoment, this.isLegalRecord, this.readLogSaveToCache);
            await this.saveTODB();
        }
        catch (error) {
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
            this.log(error.message);
        }
    }
    isLegalRecord() {
        return true;
    }
    readLogSaveToCache(record) {
        try {
            let projectId = _.get(record, ['project_id'], 0);
            let durationMs = _.get(record, ['info', 'duration_ms'], 0);
            let country = _.get(record, ['country'], '');
            let province = _.get(record, ['province'], '');
            let city = _.get(record, ['city'], '');
            let recordAt = _.get(record, ['time'], 0);
            let countAtTime = moment.unix(recordAt).format(config_1.DATABASE_BY_HOUR);
            let distributionPath = [country, province, city];
            let countAtMap = new Map();
            let distribution = {};
            if (this.projectMap.has(projectId)) {
                countAtMap = this.projectMap.get(projectId);
                if (countAtMap.has(countAtTime)) {
                    distribution = countAtMap.get(countAtTime);
                    if (_.has(distribution, distributionPath)) {
                        let oldDurationMs = _.get(distribution, distributionPath, 0);
                        durationMs = durationMs + oldDurationMs;
                    }
                }
            }
            _.set(distribution, distributionPath, durationMs);
            countAtMap.set(countAtTime, distribution);
            this.projectMap.set(projectId, countAtMap);
            return true;
        }
        catch (error) {
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
            this.log(error.message);
        }
    }
    async saveTODB() {
        try {
            let totalRecordCount = this.getRecordCountInProjectMap();
            let processRecordCount = 0;
            let successSaveCount = 0;
            for (let [projectId, countAtMap] of this.projectMap) {
                for (let [countAtTime, distribution] of countAtMap) {
                    let recordList = utils_2.getFlattenCityRecordListInDistribution(distribution);
                    let totalStayMs = 0;
                    for (let record of recordList) {
                        totalStayMs = totalStayMs + record;
                    }
                    let totalUv = await this.uniqueViewService.getTotalUv(projectId, countAtTime, config_1.UNIT.HOUR);
                    let oldRecordList = await this.durationDistributionService.replaceUvRecord(projectId, countAtTime, config_1.UNIT.HOUR);
                    let isSuccess = await this.checkSaveCount(totalUv, oldRecordList, projectId, countAtTime, distribution, totalStayMs);
                    processRecordCount = processRecordCount + 1;
                    if (isSuccess) {
                        successSaveCount = successSaveCount + 1;
                    }
                    this.reportProcess(processRecordCount, successSaveCount, totalRecordCount);
                }
            }
            return { totalRecordCount, processRecordCount, successSaveCount };
        }
        catch (error) {
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
            this.log(error.message);
        }
    }
    async checkSaveCount(totalUv, oldRecordList, projectId, countAtTime, cityDistribute, totalStayMs) {
        let updateAt = moment().unix();
        let cityDistributeIdInDb = _.get(oldRecordList, [0, 'city_distribute_id'], 0);
        let id = _.get(oldRecordList, [0, 'id'], 0);
        let createTimeInDb = _.get(oldRecordList, [0, 'create_time'], 0);
        let data = {
            project_id: projectId,
            total_uv: totalUv,
            count_at_time: countAtTime,
            update_time: moment().unix(),
            count_type: config_1.UNIT.HOUR,
            total_stay_ms: totalStayMs,
        };
        let isSuccess = false;
        if (id > 0) {
            isSuccess = await this.updateCityDistribution(id, data, projectId, createTimeInDb, cityDistribute, cityDistributeIdInDb);
        }
        else {
            isSuccess = await this.insertCityDistributionRecord(cityDistribute, data, projectId, updateAt);
        }
        return isSuccess;
    }
    async updateCityDistribution(id, data, projectId, createTimeInDb, cityDistribute, cityDistributeIdInDb) {
        let isUpdateSuccess = await this.cityDistributionService.updateCityDistributionRecord(cityDistributeIdInDb, projectId, createTimeInDb, JSON.stringify(cityDistribute));
        if (isUpdateSuccess === false) {
            return false;
        }
        let affectRows = await this.durationDistributionService.updateDuration(id, data);
        return affectRows > 0;
    }
    async insertCityDistributionRecord(cityDistribute, data, projectId, updateAt) {
        let cityDistributeId = await this.cityDistributionService.insertCityDistributionRecord(JSON.stringify(cityDistribute), projectId, updateAt);
        if (cityDistributeId === 0) {
            return false;
        }
        data['city_distribute_id'] = cityDistributeId;
        data['create_time'] = moment().unix();
        let insertResult = await this.durationDistributionService.insertDuration(data);
        let insertId = _.get(insertResult, [0], 0);
        return insertId > 0;
    }
    getRecordCountInProjectMap() {
        let totalCount = 0;
        for (let [projectId, countAtMap] of this.projectMap) {
            for (let [countAtTime, distribution] of countAtMap) {
                totalCount = totalCount + 1;
            }
        }
        return totalCount;
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", shard_1.UniqueViewService)
], TimeOnSiteByHour.prototype, "uniqueViewService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", duration_distribution_service_1.DurationDistributionService)
], TimeOnSiteByHour.prototype, "durationDistributionService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", shard_1.CityDistributionService)
], TimeOnSiteByHour.prototype, "cityDistributionService", void 0);
__decorate([
    utils_1.StartPase,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeOnSiteByHour.prototype, "handle", null);
__decorate([
    utils_1.EndParse,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeOnSiteByHour.prototype, "saveTODB", null);
exports.default = TimeOnSiteByHour;

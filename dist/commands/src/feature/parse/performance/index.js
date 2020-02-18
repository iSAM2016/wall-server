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
const shard_1 = require("../../../shard");
const performance_service_1 = require("./performance.service");
const config_1 = require("../../../config");
class Performance extends parseBase_1.default {
    constructor() {
        super(...arguments);
        this.projectMap = new Map();
    }
    static get signature() {
        return `
     Parse:Performance 
     {startAtYmdHi:日志扫描范围上限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
    }
    static get description() {
        return '[按小时] 解析kafka日志, 分析分钟级别的指定时间范围内的性能指标';
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
            let visitAt = _.get(record, ['time'], 0);
            let projectId = _.get(record, ['project_id'], 0);
            let country = _.get(record, ['country'], '');
            let province = _.get(record, ['province'], '');
            let city = _.get(record, ['city'], '');
            let detail = _.get(record, ['details'], {
                dns_lookup_ms: 1,
                tcp_connect_ms: 1,
                response_request_ms: 1,
                response_transfer_ms: 1,
                dom_parse_ms: 1,
                load_resource_ms: 1,
                ssl_connect_ms: 1,
                first_render_ms: 1,
                first_tcp_ms: 1,
                first_response_ms: 1,
                dom_ready_ms: 1,
                load_complete_ms: 1,
                url: '909090',
            });
            let url = _.get(detail, ['url'], '');
            if (_.isNumber(visitAt) === false ||
                visitAt === 0 ||
                _.isEmpty(detail) ||
                _.isString(url) === false ||
                url.length === 0) {
                this.log(`数据不合法, 自动跳过 visitAt => ${visitAt}`, 'detail =>', detail, 'url =>', url);
                return false;
            }
            let countAtMinute = moment.unix(visitAt).format(config_1.DATABASE_BY_MINUTE);
            delete detail.url;
            for (let indicator of Object.keys(detail)) {
                let indicatorValue = detail[indicator];
                let uniqIdPath = [projectId, url, indicator, countAtMinute];
                let locationPath = [country, province, city];
                let uniqIdMap = new Map();
                let result = { sum_indicator_value: 0, pv: 0 };
                uniqIdMap.set(locationPath, result);
                if (this.projectMap.has(uniqIdPath)) {
                    uniqIdMap = this.projectMap.get(uniqIdPath);
                    if (uniqIdMap.has(locationPath)) {
                        result = uniqIdMap.get(locationPath);
                    }
                    else {
                        uniqIdMap.set(locationPath, result);
                    }
                }
                else {
                    this.projectMap.set(uniqIdPath, uniqIdMap);
                }
                result['sum_indicator_value'] += indicatorValue;
                result['pv'] += 1;
                uniqIdMap.set(locationPath, result);
                this.projectMap.set(uniqIdPath, uniqIdMap);
            }
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
            for (let [[projectId, url, indicator, countAtMinute], uniqIdMap] of this
                .projectMap) {
                let cityDistribute = {};
                let sumIndicatorValueTotal = 0;
                let pvTotal = 0;
                for (let [[country, province, city], record] of uniqIdMap) {
                    let { sum_indicator_value: sumIndicatorValue, pv } = record;
                    _.set(cityDistribute, [country, province, city], {
                        pv,
                        sum_indicator_value: sumIndicatorValue,
                    });
                    pvTotal = pvTotal + pv;
                    sumIndicatorValueTotal = sumIndicatorValueTotal + sumIndicatorValue;
                }
                let countAt = moment(countAtMinute, config_1.DATABASE_BY_UNIT[config_1.UNIT.MINUTE]).unix();
                let oldRecordList = await this.performanceService.getRecordList(projectId, url, indicator, countAt, config_1.UNIT.MINUTE);
                let id = _.get(oldRecordList, [0, 'id'], 0);
                let isSuccess = await this.checkSaveCount(url, countAt, indicator, pvTotal, projectId, config_1.UNIT.MINUTE, oldRecordList, cityDistribute, sumIndicatorValueTotal);
                processRecordCount = processRecordCount + 1;
                if (isSuccess) {
                    successSaveCount = successSaveCount + 1;
                }
                this.reportProcess(processRecordCount, successSaveCount, totalRecordCount);
                return { totalRecordCount, processRecordCount, successSaveCount };
            }
        }
        catch (error) {
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
            this.log(error.message);
        }
    }
    async checkSaveCount(url, countAt, indicator, pv, projectId, countType, oldRecordList, cityDistribute, sumIndicatorValue) {
        let cityDistributeIdInDb = _.get(oldRecordList, [0, 'city_distribute_id'], 0);
        let updateAt = moment().unix();
        let id = _.get(oldRecordList, [0, 'id'], 0);
        let createTimeInDb = _.get(oldRecordList, [0, 'create_time'], 0);
        let dateFormat = config_1.DATABASE_BY_UNIT[countType];
        let countAtTime = moment.unix(countAt).format(dateFormat);
        let data = {
            url,
            indicator,
            pv,
            count_at_time: countAtTime,
            count_type: countType,
            sum_indicator_value: sumIndicatorValue,
            update_time: updateAt,
        };
        let isSuccess = false;
        if (id > 0) {
            isSuccess = await this.updateCityDistribution(id, data, projectId, countAt, createTimeInDb, cityDistribute, cityDistributeIdInDb);
        }
        else {
            isSuccess = await this.insertCityDistributionRecord(cityDistribute, data, projectId, updateAt);
        }
        return isSuccess;
    }
    async updateCityDistribution(id, data, projectId, countAt, createTimeInDb, cityDistribute, cityDistributeIdInDb) {
        let isUpdateSuccess = await this.cityDistributionService.updateCityDistributionRecord(cityDistributeIdInDb, projectId, createTimeInDb, JSON.stringify(cityDistribute));
        if (isUpdateSuccess === false) {
            return false;
        }
        let affectRows = await this.performanceService.updatePerformance(id, data, projectId, countAt);
        return affectRows > 0;
    }
    async insertCityDistributionRecord(cityDistribute, data, projectId, updateAt) {
        let cityDistributeId = await this.cityDistributionService.insertCityDistributionRecord(JSON.stringify(cityDistribute), projectId, updateAt);
        if (cityDistributeId === 0) {
            return false;
        }
        data['city_distribute_id'] = cityDistributeId;
        data['create_time'] = moment().unix();
        let insertResult = await this.performanceService.insertPerformance(data, projectId, updateAt);
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
    __metadata("design:type", performance_service_1.PerformanceService)
], Performance.prototype, "performanceService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", shard_1.CityDistributionService)
], Performance.prototype, "cityDistributionService", void 0);
__decorate([
    utils_1.StartPase,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Performance.prototype, "handle", null);
__decorate([
    utils_1.EndParse,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Performance.prototype, "saveTODB", null);
exports.default = Performance;

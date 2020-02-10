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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment");
const parseBase_1 = require("../parseBase");
const typescript_ioc_1 = require("typescript-ioc");
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const shard_1 = require("../../../shard");
const config_1 = require("../../../config");
class MenuClick extends parseBase_1.default {
    constructor() {
        super();
        this.projectMap = new Map();
    }
    static get signature() {
        return `
     Parse:MenuClick 
     {startAtYmdHi:日志扫描范围上限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
    }
    static get description() {
        return '[按天] 解析nginx日志, 用户点击情况';
    }
    handle(...arg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.readLog(this.startAtMoment, this.endAtMoment, this.isLegalRecord, this.readLogSaveToCache);
                yield this.saveTODB();
            }
            catch (error) {
                this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
                this.log(this.constructor.name + '运行异常 =>' + error.message);
            }
        });
    }
    readLogSaveToCache(record) {
        let projectId = _.get(record, ['project_id'], '');
        let name = _.get(record, ['info:', 'message'], '');
        let code = _.get(record, ['info', 'code'], '');
        let url = _.get(record, ['currentUrl'], '');
        url = decodeURIComponent(url) + '';
        if (url.length > 200) {
            url = url.slice(0, 200);
        }
        let country = _.get(record, ['country'], '');
        let province = _.get(record, ['province'], '');
        let city = _.get(record, ['city'], '');
        let recordAt = _.get(record, ['time'], 0);
        let countAtTime = moment.unix(recordAt).format(config_1.DATABASE_BY_HOUR);
        let distributionPath = [country, province, city];
        let distributeCountCount = 1;
        let countAtMap = new Map();
        let codeMap = new Map();
        let distribution = {};
        if (this.projectMap.has(projectId)) {
            countAtMap = this.projectMap.get(projectId);
            if (countAtMap.has(countAtTime)) {
                codeMap = countAtMap.get(countAtTime);
                if (codeMap.has(code)) {
                    let recordPackage = codeMap.get(code);
                    distribution = _.get(recordPackage, ['distribution'], {});
                    if (_.has(distribution, distributionPath)) {
                        let oldDistributeCount = _.get(distribution, distributionPath, 0);
                        distributeCountCount = distributeCountCount + oldDistributeCount;
                    }
                }
            }
        }
        _.set(distribution, distributionPath, distributeCountCount);
        let recordPackage = {
            code,
            distribution,
            name,
            url,
        };
        codeMap.set(code, recordPackage);
        countAtMap.set(countAtTime, codeMap);
        this.projectMap.set(projectId, countAtMap);
        return true;
    }
    isLegalRecord(record) {
        let recordType = _.get(record, ['type'], '');
        if (!recordType.includes('BEHAVIOR')) {
            return false;
        }
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
    saveTODB() {
        return __awaiter(this, void 0, void 0, function* () {
            let totalRecordCount = this.getRecordCountInProjectMap();
            let processRecordCount = 0;
            let successSaveCount = 0;
            for (let [projectId, countAtMap] of this.projectMap) {
                for (let [countAtTime, codeMap] of countAtMap) {
                    for (let [code, recordPackage] of codeMap) {
                        let { distribution, name, url } = recordPackage;
                        let recordList = utils_2.getFlattenCityRecordListInDistribution(distribution);
                        let totalCount = 0;
                        for (let record of recordList) {
                            totalCount = totalCount + record;
                        }
                        let oldRecordList = yield this.behaviorDistributionService.replaceRecord(projectId, code, countAtTime, config_1.UNIT.HOUR);
                        let isSuccess = yield this.checkSaveCount(url, name, code, projectId, totalCount, countAtTime, oldRecordList, distribution);
                        processRecordCount = processRecordCount + 1;
                        if (isSuccess) {
                            successSaveCount = successSaveCount + 1;
                        }
                        this.reportProcess(processRecordCount, successSaveCount, totalRecordCount);
                    }
                }
            }
            return { totalRecordCount, processRecordCount, successSaveCount };
        });
    }
    checkSaveCount(url, name, code, projectId, totalCount, countAtTime, oldRecordList, cityDistribute) {
        return __awaiter(this, void 0, void 0, function* () {
            let cityDistributeIdInDb = _.get(oldRecordList, [0, 'city_distribute_id'], 0);
            let updateAt = moment().unix();
            let id = _.get(oldRecordList, [0, 'id'], 0);
            let createTimeInDb = _.get(oldRecordList, [0, 'create_time'], 0);
            let data = {
                project_id: projectId,
                count_at_time: countAtTime,
                count_type: config_1.UNIT.HOUR,
                code,
                name,
                url,
                total_count: totalCount,
                update_time: moment().unix(),
            };
            let isSuccess = false;
            if (id > 0) {
                isSuccess = yield this.updateCityDistribution(id, data, projectId, createTimeInDb, cityDistribute, cityDistributeIdInDb);
            }
            else {
                isSuccess = yield this.insertCityDistributionRecord(cityDistribute, data, projectId, updateAt);
            }
            return isSuccess;
        });
    }
    updateCityDistribution(id, data, projectId, createTimeInDb, cityDistribute, cityDistributeIdInDb) {
        return __awaiter(this, void 0, void 0, function* () {
            let isUpdateSuccess = yield this.cityDistributionService.updateCityDistributionRecord(cityDistributeIdInDb, projectId, createTimeInDb, JSON.stringify(cityDistribute));
            if (isUpdateSuccess === false) {
                return false;
            }
            let affectRows = yield this.behaviorDistributionService.updateBehavior(id, data);
            return affectRows > 0;
        });
    }
    insertCityDistributionRecord(cityDistribute, data, projectId, updateAt) {
        return __awaiter(this, void 0, void 0, function* () {
            let cityDistributeId = yield this.cityDistributionService.insertCityDistributionRecord(JSON.stringify(cityDistribute), projectId, updateAt);
            if (cityDistributeId === 0) {
                return false;
            }
            data['city_distribute_id'] = cityDistributeId;
            data['create_time'] = moment().unix();
            let insertResult = yield this.behaviorDistributionService.insertDuration(data);
            let insertId = _.get(insertResult, [0], 0);
            return insertId > 0;
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", shard_1.BehaviorDistributionService)
], MenuClick.prototype, "behaviorDistributionService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", shard_1.CityDistributionService)
], MenuClick.prototype, "cityDistributionService", void 0);
__decorate([
    utils_1.StartPase,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuClick.prototype, "handle", null);
__decorate([
    utils_1.EndParse,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MenuClick.prototype, "saveTODB", null);
exports.default = MenuClick;

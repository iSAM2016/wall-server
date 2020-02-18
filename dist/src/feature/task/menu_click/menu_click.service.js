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
var MenuClickService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment");
const paseBase_1 = require("../paseBase");
const typeorm_1 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const _entity_1 = require("../../../entity");
const _utils_1 = require("../../../utils");
const DateFormat = 'YYYYMM';
let MenuClickService = MenuClickService_1 = class MenuClickService extends paseBase_1.default {
    constructor(behaviorDistributionRepository, cityDistributionRepository) {
        super();
        this.behaviorDistributionRepository = behaviorDistributionRepository;
        this.cityDistributionRepository = cityDistributionRepository;
        this.logger = new common_1.Logger(MenuClickService_1.name);
        this.projectMap = new Map();
        this.updateBehavior = async (id, data) => {
            let result = await this.behaviorDistributionRepository.findOne({
                id,
            });
            let updateResult = await this.behaviorDistributionRepository.save(Object.assign(Object.assign({}, result), data));
            return updateResult;
        };
    }
    async handle() {
        let nowByMinute = moment();
        let lastDayStartAtByMinute = moment()
            .subtract(1, 'day')
            .startOf('day');
        this.startAtMoment = lastDayStartAtByMinute;
        this.endAtMoment = nowByMinute;
        this.logger.log(`开始分析${this.startAtMoment.format(_utils_1.COMMAND_ARGUMENT_BY_MINUTE) +
            ':00'}~${this.endAtMoment.format(_utils_1.COMMAND_ARGUMENT_BY_MINUTE) +
            ':59'}范围内的记录`);
        await this.readLog(this.startAtMoment, this.endAtMoment, this.isLegalRecord, this.readLogSaveToCache);
        await this.saveTODB();
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
        let countAtTime = moment.unix(recordAt).format(_utils_1.DATABASE_BY_HOUR);
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
    async saveTODB() {
        let totalRecordCount = this.getRecordCountInProjectMap();
        let processRecordCount = 0;
        let successSaveCount = 0;
        for (let [projectId, countAtMap] of this.projectMap) {
            for (let [countAtTime, codeMap] of countAtMap) {
                for (let [code, recordPackage] of codeMap) {
                    let { distribution, name, url } = recordPackage;
                    let recordList = _utils_1.getFlattenCityRecordListInDistribution(distribution);
                    let totalCount = 0;
                    for (let record of recordList) {
                        totalCount = totalCount + record;
                    }
                    let oldRecordList = await this.replaceRecord(projectId, code, countAtTime, _utils_1.UNIT.HOUR);
                    let isSuccess = await this.checkSaveCount(url, name, code, projectId, totalCount, countAtTime, oldRecordList, distribution);
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
    async checkSaveCount(url, name, code, projectId, totalCount, countAtTime, oldRecordList, cityDistribute) {
        let cityDistributeIdInDb = _.get(oldRecordList, [0, 'cityDistributeId'], 0);
        let updateAt = moment().unix();
        let id = _.get(oldRecordList, [0, 'id'], 0);
        let data = {
            projectId,
            countAtTime,
            countType: _utils_1.UNIT.HOUR,
            code,
            name,
            url,
            totalCount,
            update_time: moment().unix(),
        };
        let isSuccess = false;
        if (id > 0) {
            isSuccess = await this.updateCityDistribution(id, data, cityDistribute, cityDistributeIdInDb);
        }
        else {
            isSuccess = await this.insertData(cityDistribute, data, projectId, updateAt);
        }
        return isSuccess;
    }
    async updateCityDistribution(id, data, cityDistribute, cityDistributeIdInDb) {
        let isUpdateSuccess = await this.updateCityDistributionRecord(cityDistributeIdInDb, JSON.stringify(cityDistribute));
        if (isUpdateSuccess === false) {
            return false;
        }
        let affectRows = await this.updateBehavior(id, data);
        return affectRows > 0;
    }
    async insertData(cityDistribute, data, projectId, updateAt) {
        let cityDistributeId = await this.insertCityDistributionRecord(JSON.stringify(cityDistribute), projectId, updateAt);
        if (cityDistributeId === 0) {
            return false;
        }
        data['cityDistributeId'] = cityDistributeId;
        data['createTime'] = moment().unix();
        let insertResult = await this.insertDuration(data);
        let insertId = _.get(insertResult, 'id', 0);
        return insertId > 0;
    }
    async replaceRecord(projectId, code, countAtTime, countType) {
        let oldRecordList = await this.behaviorDistributionRepository
            .createQueryBuilder()
            .where({ projectId, countAtTime, code, countType })
            .getMany();
        return oldRecordList;
    }
    async insertDuration(data) {
        return await this.behaviorDistributionRepository.save(data);
    }
    async updateCityDistributionRecord(id, cityDistributeJson) {
        let updateAt = moment().unix();
        let data = {
            cityDistributeJson,
            updateTime: String(updateAt),
        };
        let result = await this.cityDistributionRepository.findOne({ id });
        let affectRows = await this.cityDistributionRepository.save(Object.assign(Object.assign({}, result), data));
        return Number(affectRows.id) > 0;
    }
    async insertCityDistributionRecord(cityDistributeJson, projectId, createTimeAt) {
        let countAtTime = moment.unix(createTimeAt).format(DateFormat);
        let updateAt = moment().unix();
        let data = {
            cityDistributeJson,
            createTime: String(updateAt),
            updateTime: String(updateAt),
            projectId,
            countAtTime,
        };
        let insertResult = await this.cityDistributionRepository.save(data);
        let insertId = _.get(insertResult, 'id', 0);
        return insertId;
    }
};
__decorate([
    schedule_1.Cron('30 15 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MenuClickService.prototype, "handle", null);
MenuClickService = MenuClickService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(_entity_1.TRBehaviorDistribution)),
    __param(1, typeorm_2.InjectRepository(_entity_1.TRCityDistribution)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], MenuClickService);
exports.MenuClickService = MenuClickService;

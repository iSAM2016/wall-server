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
var TimeOnSiteService_1;
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
let TimeOnSiteService = TimeOnSiteService_1 = class TimeOnSiteService extends paseBase_1.default {
    constructor(durationDistributionRepository, cityDistributionRepository, uniqueViewRepository) {
        super();
        this.durationDistributionRepository = durationDistributionRepository;
        this.cityDistributionRepository = cityDistributionRepository;
        this.uniqueViewRepository = uniqueViewRepository;
        this.logger = new common_1.Logger(TimeOnSiteService_1.name);
        this.projectMap = new Map();
        this.replaceUvRecord = async (projectId, countAtTime, countType) => {
            let oldRecordList = await this.durationDistributionRepository
                .createQueryBuilder()
                .where({
                projectId,
                countAtTime,
                countType,
            })
                .getMany();
            return oldRecordList;
        };
        this.updateDuration = async (id, data) => {
            let result = await this.durationDistributionRepository.findOne({
                id,
            });
            let updateResult = await this.durationDistributionRepository.save(Object.assign(Object.assign({}, result), data));
            return updateResult;
        };
    }
    async handle() {
        let nowByMinute = moment();
        let fifteenMinuteAgoByminute = moment().subtract(15, 'minute');
        this.startAtMoment = fifteenMinuteAgoByminute;
        this.endAtMoment = nowByMinute;
        this.logger.log(`开始分析${this.startAtMoment.format(_utils_1.COMMAND_ARGUMENT_BY_MINUTE) +
            ':00'}~${this.endAtMoment.format(_utils_1.COMMAND_ARGUMENT_BY_MINUTE) +
            ':59'}范围内的记录`);
        await this.readLog(this.startAtMoment, this.endAtMoment, this.isLegalRecord, this.readLogSaveToCache);
        await this.saveTODB();
    }
    readLogSaveToCache(record) {
        let projectId = _.get(record, ['project_id'], 0);
        let durationMs = _.get(record, ['info', 'duration_ms'], 0);
        let country = _.get(record, ['country'], '');
        let province = _.get(record, ['province'], '');
        let city = _.get(record, ['city'], '');
        let recordAt = _.get(record, ['time'], 0);
        let countAtTime = moment.unix(recordAt).format(_utils_1.DATABASE_BY_HOUR);
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
    isLegalRecord(record) {
        return true;
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
    async saveTODB() {
        let totalRecordCount = this.getRecordCountInProjectMap();
        let processRecordCount = 0;
        let successSaveCount = 0;
        for (let [projectId, countAtMap] of this.projectMap) {
            for (let [countAtTime, distribution] of countAtMap) {
                let recordList = _utils_1.getFlattenCityRecordListInDistribution(distribution);
                let totalStayMs = 0;
                for (let record of recordList) {
                    totalStayMs = totalStayMs + record;
                }
                let totalUv = await this.getTotalUv(projectId, countAtTime, _utils_1.UNIT.HOUR);
                let oldRecordList = await this.replaceUvRecord(projectId, countAtTime, _utils_1.UNIT.HOUR);
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
    async checkSaveCount(totalUv, oldRecordList, projectId, countAtTime, cityDistribute, totalStayMs) {
        let cityDistributeIdInDb = _.get(oldRecordList, [0, 'cityDistributeId'], 0);
        let updateAt = moment().unix();
        let id = _.get(oldRecordList, [0, 'id'], 0);
        let data = {
            projectId,
            totalUv,
            countAtTime,
            updateTime: moment().unix(),
            countType: _utils_1.UNIT.HOUR,
            totalStayMs,
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
        let affectRows = await this.updateDuration(id, data);
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
    async getTotalUv(projectId, countAtTime, countType) {
        let recordList = await this.uniqueViewRepository
            .createQueryBuilder()
            .where({ projectId, countAtTime, countType })
            .getMany();
        let record = _.get(recordList, [0], {});
        return _.get(record, ['total_count'], 0);
    }
    async insertDuration(data) {
        return await this.durationDistributionRepository.save(data);
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
    schedule_1.Cron('15 */10 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeOnSiteService.prototype, "handle", null);
TimeOnSiteService = TimeOnSiteService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(_entity_1.TRDurationDistribution)),
    __param(1, typeorm_2.InjectRepository(_entity_1.TRCityDistribution)),
    __param(2, typeorm_2.InjectRepository(_entity_1.TRUniqueView)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], TimeOnSiteService);
exports.TimeOnSiteService = TimeOnSiteService;

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
var UvService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment");
const paseBase_1 = require("../paseBase");
const typeorm_1 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const _entity_1 = require("../../../entity");
const common_1 = require("@nestjs/common");
const _utils_1 = require("../../../utils");
const typeorm_2 = require("@nestjs/typeorm");
let UvService = UvService_1 = class UvService extends paseBase_1.default {
    constructor(uvRepository) {
        super();
        this.uvRepository = uvRepository;
        this.logger = new common_1.Logger(UvService_1.name);
        this.projectMap = new Map();
        this.getExistUuidSetInHour = async (projectId, visitAt) => {
            let visitAtHour = moment.unix(visitAt).format(_utils_1.DATABASE_BY_HOUR);
            let rawRecordList = await this.uvRepository
                .createQueryBuilder()
                .where({ visitAtHour, projectId })
                .getMany();
            let uuidSet = new Set();
            rawRecordList.forEach(rawRecord => {
                let uuid = _.get(rawRecord, ['uuid'], '');
                uuidSet.add(uuid);
            });
            return uuidSet;
        };
        this.replaceUvRecord = async (projectId, uuid, visitAt, country, province, city) => {
            let pvCount = 0;
            let visitAtHour = moment.unix(visitAt).format(_utils_1.DATABASE_BY_HOUR);
            let updateAt = moment().unix();
            let oldRecordList = await this.uvRepository
                .createQueryBuilder()
                .where({ uuid, visitAtHour, projectId })
                .getMany();
            let id = _.get(oldRecordList, [0, 'id'], 0);
            let data = {
                uuid,
                country,
                province,
                city,
                visitAtHour,
                projectId,
                pvCount,
                updateTime: String(updateAt),
            };
            let isSuccess = false;
            if (id > 0) {
                let result = await this.uvRepository.findOne({ id });
                let affectRows = await this.uvRepository.save(Object.assign(Object.assign({}, result), data));
                isSuccess = true;
            }
            else {
                data['createTime'] = String(updateAt);
                let insertResult = await this.uvRepository.save(data);
                let insertId = _.get(insertResult, [0], 0);
                isSuccess = insertId > 0;
            }
            return isSuccess;
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
        let uuid = _.get(record, ['uuid'], '');
        let visitAt = _.get(record, ['time'], 0);
        let projectId = _.get(record, ['project_id'], 0);
        let country = _.get(record, ['country'], '');
        let province = _.get(record, ['province'], '');
        let city = _.get(record, ['city'], '');
        let pvCount = 1;
        if (_.isNumber(visitAt) === false || visitAt === 0 || _.isEmpty({ uuid })) {
            this.logger.log(`数据不合法, 自动跳过 visitAt => ${visitAt}, uuid => ${uuid}`);
            return false;
        }
        let visitAtHour = moment.unix(visitAt).format(_utils_1.DATABASE_BY_MINUTE);
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
            for (let [visitAtHour, uvMap] of visitAtMap) {
                let visitAtInDb = moment(visitAtHour, _utils_1.DATABASE_BY_MINUTE).unix();
                let existUuidSet = await this.getExistUuidSetInHour(projectId, visitAtInDb);
                for (let [uv, uvRecord] of uvMap) {
                    let { projectId, visitAt, uuid, country, province, city, pvCount, } = uvRecord;
                    let isSuccess = false;
                    uuid = `${uuid}`;
                    if (existUuidSet.has(uuid) === false) {
                        isSuccess = await this.replaceUvRecord(projectId, uuid, visitAt, country, province, city);
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
};
__decorate([
    schedule_1.Cron('15 */10 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UvService.prototype, "handle", null);
UvService = UvService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(_entity_1.TRUvRecord)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UvService);
exports.UvService = UvService;

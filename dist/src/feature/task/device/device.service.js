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
var DeviceService_1;
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
let DeviceService = DeviceService_1 = class DeviceService extends paseBase_1.default {
    constructor(deviceRepository) {
        super();
        this.deviceRepository = deviceRepository;
        this.logger = new common_1.Logger(DeviceService_1.name);
        this.projectMap = new Map();
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
        let visitAtMonth = moment.unix(visitAt).format(_utils_1.DATABASE_BY_MONTH);
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
                        uuid,
                        browser: deviceRecord.browser,
                        browserVersion: deviceRecord.browserVersion,
                        engine: deviceRecord.engine,
                        engineVersion: deviceRecord.engineVersion,
                        deviceVendor: deviceRecord.deviceVendor,
                        deviceModel: deviceRecord.deviceModel,
                        os: deviceRecord.os,
                        osVersion: deviceRecord.osVersion,
                        country: deviceRecord.country,
                        province: deviceRecord.province,
                        city: deviceRecord.city,
                        runtimeVersion: deviceRecord.runtimeVersion,
                        visitAtMonth,
                        projectId,
                        logAt: visitAt,
                    };
                    let oldListRest = await this.getOldList(projectId, visitAtMonth, uuid);
                    let id = _.get(oldListRest, [0, 'id'], 0);
                    let updateAt = moment().unix();
                    let isSuccess = false;
                    if (id > 0) {
                        sqlParams['updateTime'] = String(updateAt);
                        let affectRows = await this.updataDevice(sqlParams, id);
                        isSuccess = affectRows > 0;
                    }
                    else {
                        sqlParams['createTime'] = String(updateAt);
                        sqlParams['updateTime'] = String(updateAt);
                        const insertId = await this.createDevice(sqlParams);
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
    async getOldList(projectId, visitAtMonth, uuid) {
        let oldListResult = await this.deviceRepository
            .createQueryBuilder()
            .where({ visitAtMonth, uuid, projectId })
            .getMany();
        return oldListResult;
    }
    async updataDevice(datas, id) {
        let result = await this.deviceRepository.createQueryBuilder().where({ id });
        let affectRows = await this.deviceRepository.save(Object.assign(Object.assign({}, result), datas));
        return affectRows;
    }
    async createDevice(datas) {
        let createResultId = await this.deviceRepository.save(datas);
        return createResultId;
    }
};
__decorate([
    schedule_1.Cron('30 15 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeviceService.prototype, "handle", null);
DeviceService = DeviceService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(_entity_1.TRSystemCollection)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], DeviceService);
exports.DeviceService = DeviceService;

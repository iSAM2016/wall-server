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
var UserFirstLoginAtService_1;
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
let UserFirstLoginAtService = UserFirstLoginAtService_1 = class UserFirstLoginAtService extends paseBase_1.default {
    constructor(userFirstLoginAtRepository) {
        super();
        this.userFirstLoginAtRepository = userFirstLoginAtRepository;
        this.logger = new common_1.Logger(UserFirstLoginAtService_1.name);
        this.projectMap = new Map();
        this.updateUserFirstLoginAt = async (id, data) => {
            console.log(999);
            let result = await this.userFirstLoginAtRepository.findOne({
                id,
            });
            let updateResult = await this.userFirstLoginAtRepository.save(Object.assign(Object.assign({}, result), data));
            return updateResult;
        };
    }
    async handle() {
        let nowByMinute = moment();
        let lastDayStartAtByMinute = moment()
            .subtract(1, 'minute')
            .startOf('minute');
        this.startAtMoment = lastDayStartAtByMinute;
        this.endAtMoment = nowByMinute;
        this.logger.log(`开始分析${this.startAtMoment.format(_utils_1.COMMAND_ARGUMENT_BY_MINUTE) +
            ':00'}~${this.endAtMoment.format(_utils_1.COMMAND_ARGUMENT_BY_MINUTE) +
            ':59'}范围内的记录`);
        await this.readLog(this.startAtMoment, this.endAtMoment, this.isLegalRecord, this.readLogSaveToCache);
        await this.saveTODB();
    }
    readLogSaveToCache(record) {
        let ucid = _.get(record, ['userId'], '');
        let projectId = _.get(record, ['project_id'], '');
        let country = _.get(record, ['country'], '');
        let province = _.get(record, ['province'], '');
        let city = _.get(record, ['city'], '');
        let firstVisitAt = _.get(record, ['time'], 0);
        let dbRecordMap = new Map();
        let dbRecord = {
            ucid,
            projectId,
            country,
            province,
            city,
            firstVisitAt,
        };
        if (this.projectMap.has(projectId)) {
            dbRecordMap = this.projectMap.get(projectId);
            if (dbRecordMap.has(ucid)) {
                let existRecord = dbRecordMap.get(ucid);
                if (existRecord['first_visit_at'] > dbRecord['first_visit_at']) {
                    dbRecordMap.set(ucid, dbRecord);
                }
            }
        }
        else {
            dbRecordMap.set(ucid, dbRecord);
        }
        this.projectMap.set(projectId, dbRecordMap);
        return true;
    }
    isLegalRecord() {
        return true;
    }
    getRecordCountInProjectMap() {
        let totalCount = 0;
        for (let [projectId, dbRecordMap] of this.projectMap) {
            for (let [ucid, dbRecord] of dbRecordMap) {
                totalCount = totalCount + 1;
            }
        }
        return totalCount;
    }
    async saveTODB() {
        let totalRecordCount = this.getRecordCountInProjectMap();
        let processRecordCount = 0;
        let successSaveCount = 0;
        for (let [projectId, dbRecordMap] of this.projectMap) {
            let ucidList = [];
            for (let ucid of dbRecordMap.keys()) {
                ucidList.push(ucid);
            }
            let existUcidSet = await this.filterExistUcidSetInDb(projectId, ucidList);
            for (let [ucid, dbRecord] of dbRecordMap) {
                let { projectId, country, province, city, firstVisitAt } = dbRecord;
                let isSuccess = false;
                ucid = `${ucid}`;
                if (existUcidSet.has(ucid) === false) {
                    let updateAt = moment().unix();
                    let oldRecordList = await this.getOldRecordList(projectId, ucid);
                    console.log(oldRecordList);
                    let id = _.get(oldRecordList, [0, 'id'], 0);
                    let oldFirstVisitAt = _.get(oldRecordList, [0, 'firstVisitAt'], 0);
                    let data = {
                        projectId,
                        ucid,
                        firstVisitAt,
                        country,
                        province,
                        city,
                        updateTime: updateAt,
                    };
                    let isSuccess = false;
                    if (id > 0) {
                        if (oldFirstVisitAt > 0 && oldFirstVisitAt > firstVisitAt) {
                            let affectRows = await this.updateUserFirstLoginAt(id, data);
                            isSuccess = affectRows > 0;
                        }
                    }
                    else {
                        data['createTime'] = updateAt;
                        let insertResult = await this.insertUserFirstLoginAt(data);
                        let insertId = _.get(insertResult, [0], 0);
                        isSuccess = insertId > 0;
                    }
                }
                processRecordCount = processRecordCount + 1;
                if (isSuccess) {
                    successSaveCount = successSaveCount + 1;
                }
                this.reportProcess(processRecordCount, successSaveCount, totalRecordCount);
            }
        }
        return { totalRecordCount, processRecordCount, successSaveCount };
    }
    async filterExistUcidSetInDb(projectId, allUcidList) {
        let rawRecordList = await this.userFirstLoginAtRepository
            .createQueryBuilder()
            .where({ projectId })
            .getMany();
        let existUcidSet = new Set();
        for (let rawRecord of rawRecordList) {
            let ucid = _.get(rawRecord, ['ucid'], '');
            existUcidSet.add(ucid);
        }
        return existUcidSet;
    }
    async getOldRecordList(projectId, ucid) {
        let oldRecordList = await this.userFirstLoginAtRepository
            .createQueryBuilder()
            .where({ projectId, ucid })
            .getMany();
        console.log(oldRecordList);
        return oldRecordList;
    }
    async insertUserFirstLoginAt(data) {
        return await this.userFirstLoginAtRepository.save(data);
    }
};
__decorate([
    schedule_1.Cron('30 15 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserFirstLoginAtService.prototype, "handle", null);
UserFirstLoginAtService = UserFirstLoginAtService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(_entity_1.TRUserFirstLoginAt)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserFirstLoginAtService);
exports.UserFirstLoginAtService = UserFirstLoginAtService;

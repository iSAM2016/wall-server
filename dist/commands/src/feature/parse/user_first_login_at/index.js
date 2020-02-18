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
const user_first_login_at_service_1 = require("./user_first_login_at.service");
const config_1 = require("../../../config");
class UserFirstLoginAt extends parseBase_1.default {
    constructor() {
        super();
        this.projectMap = new Map();
    }
    static get signature() {
        return `
     Parse:UserFirstLoginAt 
     {startAtYmdHi:日志扫描范围上限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${config_1.COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
    }
    static get description() {
        return '[按天] 解析nginx日志, 记录用户首次登陆时间';
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
        let ucid = _.get(record, ['userId'], '');
        let projectId = _.get(record, ['project_id'], '');
        let country = _.get(record, ['country'], '');
        let province = _.get(record, ['province'], '');
        let city = _.get(record, ['city'], '');
        let firstVisitAt = _.get(record, ['time'], 0);
        let dbRecordMap = new Map();
        let dbRecord = {
            ucid,
            project_id: projectId,
            country,
            province,
            city,
            first_visit_at: firstVisitAt,
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
        try {
            let totalRecordCount = this.getRecordCountInProjectMap();
            let processRecordCount = 0;
            let successSaveCount = 0;
            for (let [projectId, dbRecordMap] of this.projectMap) {
                let ucidList = [];
                for (let ucid of dbRecordMap.keys()) {
                    ucidList.push(ucid);
                }
                let existUcidSet = await this.userFirstLoginAtService.filterExistUcidSetInDb(projectId, ucidList);
                for (let [ucid, dbRecord] of dbRecordMap) {
                    let { project_id: projectId, country, province, city, first_visit_at: firstVisitAt, } = dbRecord;
                    let isSuccess = false;
                    ucid = `${ucid}`;
                    if (existUcidSet.has(ucid) === false) {
                        let updateAt = moment().unix();
                        let oldRecordList = await this.userFirstLoginAtService.getOldRecordList(projectId, ucid);
                        let id = _.get(oldRecordList, [0, 'id'], 0);
                        let oldFirstVisitAt = _.get(oldRecordList, [0, 'first_visit_at'], 0);
                        let data = {
                            ucid,
                            first_visit_at: firstVisitAt,
                            country,
                            province,
                            city,
                            update_time: updateAt,
                        };
                        let isSuccess = false;
                        if (id > 0) {
                            if (oldFirstVisitAt > 0 && oldFirstVisitAt > firstVisitAt) {
                                let affectRows = await this.userFirstLoginAtService.updateUserFirstLoginAt(id, data, projectId);
                                isSuccess = affectRows > 0;
                            }
                        }
                        else {
                            data['create_time'] = updateAt;
                            let insertResult = await this.userFirstLoginAtService.insertUserFirstLoginAt(data, projectId);
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
        catch (error) {
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
            this.log(error.message);
        }
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", user_first_login_at_service_1.UserFirstLoginAtService)
], UserFirstLoginAt.prototype, "userFirstLoginAtService", void 0);
__decorate([
    utils_1.StartPase,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserFirstLoginAt.prototype, "handle", null);
__decorate([
    utils_1.EndParse,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserFirstLoginAt.prototype, "saveTODB", null);
exports.default = UserFirstLoginAt;

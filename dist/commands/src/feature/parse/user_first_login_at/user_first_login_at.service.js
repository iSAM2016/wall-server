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
const utils_1 = require("../../../utils");
const shard_1 = require("../../../shard");
const BASE_TABLE_NAME = 't_r_user_first_login_at';
const TABLE_COLUMN = [
    `id`,
    `ucid`,
    `first_visit_at`,
    `country`,
    `province`,
    `city`,
    `create_time`,
    `update_time`,
];
function getTableName(projectId) {
    return `${BASE_TABLE_NAME}_${projectId}`;
}
class UserFirstLoginAtService extends shard_1.BaseService {
    constructor() {
        super(...arguments);
        this.updateUserFirstLoginAt = async (id, data, projectId) => {
            let tableName = getTableName(projectId);
            let updateResult = await this.userFirstLoginAtRepository(tableName)
                .update(data)
                .where(`id`, '=', id);
            return updateResult;
        };
    }
    async filterExistUcidSetInDb(projectId, allUcidList) {
        let tableName = getTableName(projectId);
        let rawRecordList = await this.userFirstLoginAtRepository
            .select('ucid')
            .from(tableName)
            .whereIn('ucid', allUcidList);
        let existUcidSet = new Set();
        for (let rawRecord of rawRecordList) {
            let ucid = _.get(rawRecord, ['ucid'], '');
            existUcidSet.add(ucid);
        }
        return existUcidSet;
    }
    async getOldRecordList(projectId, ucid) {
        let tableName = getTableName(projectId);
        let oldRecordList = await this.userFirstLoginAtRepository
            .select([`id`, `first_visit_at`])
            .from(tableName)
            .where('ucid', '=', ucid)
            .catch(err => {
            this.log('插入插入页面统计数据失败 => 出错' + err.message);
            return [];
        });
        return oldRecordList;
    }
    async insertUserFirstLoginAt(data, projectId) {
        let tableName = getTableName(projectId);
        let result = await this.userFirstLoginAtRepository
            .returning('id')
            .insert(data)
            .into(tableName)
            .catch(err => {
            this.log('插入插入页面统计数据失败 => 出错' + err.message);
            return [];
        });
        return result;
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], UserFirstLoginAtService.prototype, "userFirstLoginAtRepository", void 0);
exports.UserFirstLoginAtService = UserFirstLoginAtService;

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
const utils_1 = require("../utils");
const serviceBase_1 = require("./serviceBase");
const BASE_TABLE_NAME = 't_r_unique_view';
const TABLE_COLUMN = [
    `id`,
    `project_id`,
    `total_count`,
    `count_at_time`,
    `count_type`,
    `city_distribute_id`,
    `create_time`,
    `update_time`,
];
function getTableName() {
    return BASE_TABLE_NAME;
}
class UniqueViewService extends serviceBase_1.BaseService {
    async getRecord(projectId, countAtTime, countType) {
        let tableName = getTableName();
        let recordList = await this.uniqueViewRepository
            .select(TABLE_COLUMN)
            .from(tableName)
            .where('project_id', '=', projectId)
            .andWhere('count_at_time', '=', countAtTime)
            .andWhere('count_type', '=', countType)
            .catch(err => {
            this.log('获取uv记录总数 => 出错' + err.message);
            return [];
        });
        return _.get(recordList, [0], {});
    }
    async getTotalUv(projectId, countAtTime, countType) {
        let record = await this.getRecord(projectId, countAtTime, countType);
        return _.get(record, ['total_count'], 0);
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], UniqueViewService.prototype, "uniqueViewRepository", void 0);
exports.UniqueViewService = UniqueViewService;

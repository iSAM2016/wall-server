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
const utils_1 = require("../utils");
const serviceBase_1 = require("./serviceBase");
const TABLE_NAME = 't_r_behavior_distribution';
const TABLE_COLUMN = [
    `id`,
    `project_id`,
    `code`,
    `name`,
    `url`,
    `total_count`,
    `count_at_time`,
    `count_type`,
    `city_distribute_id`,
    `create_time`,
    `update_time`,
];
function getTableName() {
    return TABLE_NAME;
}
class BehaviorDistributionService extends serviceBase_1.BaseService {
    constructor() {
        super(...arguments);
        this.updateBehavior = async (id, data) => {
            let tableName = getTableName();
            let updateResult = await this.behaviorDistributionRepository(tableName)
                .update(data)
                .where(`id`, '=', id);
            return updateResult;
        };
    }
    async replaceRecord(projectId, code, countAtTime, countType) {
        let tableName = getTableName();
        let oldRecordList = await this.behaviorDistributionRepository
            .select([`total_count`, `city_distribute_id`, `create_time`, `id`])
            .from(tableName)
            .where('project_id', '=', projectId)
            .andWhere('count_at_time', '=', countAtTime)
            .andWhere('code', '=', code)
            .andWhere('count_type', '=', countType)
            .catch(() => {
            return [];
        });
        return oldRecordList;
    }
    async insertDuration(data) {
        let tableName = getTableName();
        let result = await this.behaviorDistributionRepository
            .returning('id')
            .insert(data)
            .into(tableName)
            .catch(err => {
            this.log('插入用户行为数据失败 => 出错' + err.message);
            return [];
        });
        return result;
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], BehaviorDistributionService.prototype, "behaviorDistributionRepository", void 0);
exports.BehaviorDistributionService = BehaviorDistributionService;

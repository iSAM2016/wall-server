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
const utils_1 = require("../../../utils");
const shard_1 = require("../../../shard");
const TableName = 't_r_duration_distribution';
const TABLE_COLUMN = [
    `id`,
    `project_id`,
    `total_stay_ms`,
    `total_uv`,
    `count_at_time`,
    `count_type`,
    `city_distribute_id`,
    `create_time`,
    `update_time`,
];
function getTableName() {
    return TableName;
}
class DurationDistributionService extends shard_1.BaseService {
    constructor() {
        super(...arguments);
        this.replaceUvRecord = (projectId, countAtTime, countType) => __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName();
            let oldRecordList = yield this.durationDistributionRepository
                .select([`city_distribute_id`, `create_time`, `id`])
                .from(tableName)
                .where('project_id', '=', projectId)
                .andWhere('count_at_time', '=', countAtTime)
                .andWhere('count_type', '=', countType)
                .catch(err => {
                this.log('获取uv记录失败 => 出错' + err.message);
                return [];
            });
            return oldRecordList;
        });
        this.updateDuration = (id, data) => __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName();
            let updateResult = yield this.durationDistributionRepository(tableName)
                .update(data)
                .where(`id`, '=', id);
            return updateResult;
        });
    }
    insertDuration(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName();
            let result = yield this.durationDistributionRepository
                .returning('id')
                .insert(data)
                .into(tableName)
                .catch(err => {
                this.log('插入用户停留时间数据失败 => 出错' + err.message);
                return [];
            });
            return result;
        });
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], DurationDistributionService.prototype, "durationDistributionRepository", void 0);
exports.DurationDistributionService = DurationDistributionService;

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
const moment = require("moment");
const config_1 = require("../../../config");
const utils_1 = require("../../../utils");
const shard_1 = require("../../../shard");
const BASE_TABLE_NAME = 't_r_performance';
const TABLE_COLUMN = [
    `id`,
    `sum_indicator_value`,
    `pv`,
    `indicator`,
    `url`,
    `city_distribute_id`,
    `count_at_time`,
    `count_type`,
    `create_time`,
    `update_time`,
];
function getTableName(projectId, createAt) {
    let createAtMoment = moment.unix(createAt);
    let monthStr = createAtMoment.clone().format('YYYYMM');
    return `${BASE_TABLE_NAME}_${projectId}_${monthStr}`;
}
class PerformanceService extends shard_1.BaseService {
    constructor() {
        super(...arguments);
        this.updatePerformance = (id, data, projectId, countAt) => __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName(projectId, countAt);
            let updateResult = yield this.performanceRepository(tableName)
                .update(data)
                .where(`id`, '=', id);
            return updateResult;
        });
    }
    getRecordList(projectId, url, indicator, countAt, countType = config_1.UNIT.MINUTE) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName(projectId, countAt);
            let dateFormat = config_1.DATABASE_BY_UNIT[countType];
            let countAtTime = moment.unix(countAt).format(dateFormat);
            let oldRecordList = yield this.performanceRepository
                .select([`id`, `create_time`, `city_distribute_id`])
                .from(tableName)
                .where({
                url: url,
                indicator: indicator,
                count_at_time: countAtTime,
                count_type: countType,
            })
                .catch(err => {
                this.log(' 页面性能查询失败, 错误原因 => 出错' + err.message);
                return [];
            });
            return oldRecordList;
        });
    }
    insertPerformance(data, projectId, countAt) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName(projectId, countAt);
            let result = yield this.performanceRepository
                .returning('id')
                .insert(data)
                .into(tableName)
                .catch(err => {
                this.log('插入插入页面统计数据失败 => 出错' + err.message);
                return [];
            });
            return result;
        });
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], PerformanceService.prototype, "performanceRepository", void 0);
exports.PerformanceService = PerformanceService;

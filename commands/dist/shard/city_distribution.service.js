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
const _ = require("lodash");
const moment = require("moment");
const utils_1 = require("../utils");
const serviceBase_1 = require("./serviceBase");
const DateFormat = 'YYYYMM';
const BaseTableName = 't_r_city_distribution';
const TABLE_COLUMN = [
    `id`,
    `city_distribute_json`,
    `create_time`,
    `update_time`,
];
function getTableName(projectId, createTimeAt) {
    let YmDate = moment.unix(createTimeAt).format(DateFormat);
    return BaseTableName + '_' + projectId + '_' + YmDate;
}
class CityDistributionService extends serviceBase_1.BaseService {
    insertCityDistributionRecord(cityDistributeJson, projectId, createTimeAt) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName(projectId, createTimeAt);
            let updateAt = moment().unix();
            let data = {
                city_distribute_json: cityDistributeJson,
                create_time: updateAt,
                update_time: updateAt,
            };
            let insertResult = yield this.cityDistributionRepository
                .returning('id')
                .insert(data)
                .into(tableName)
                .catch(err => {
                this.log('城市数据插入失败 => 出错' + err.message);
                return [];
            });
            let insertId = _.get(insertResult, [0], 0);
            return insertId;
        });
    }
    updateCityDistributionRecord(id, projectId, createTimeAt, cityDistributeJson) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName(projectId, createTimeAt);
            let updateAt = moment().unix();
            let data = {
                city_distribute_json: cityDistributeJson,
                update_time: updateAt,
            };
            let affectRows = yield this.cityDistributionRepository(tableName)
                .update(data)
                .where('id', '=', id)
                .catch(e => {
                this.log('城市数据更新失败, 错误原因 =>', e.message);
                return 0;
            });
            return affectRows > 0;
        });
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], CityDistributionService.prototype, "cityDistributionRepository", void 0);
exports.CityDistributionService = CityDistributionService;

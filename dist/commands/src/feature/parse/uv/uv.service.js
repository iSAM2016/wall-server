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
const shard_1 = require("../../../shard");
const config_1 = require("../../../config");
const annotation_1 = require("../../../utils/annotation");
const TableNameDateFormat = 'YYYYMM';
const BASE_TABLE_NAME = 't_r_uv_record';
function getTableName(projectId, createTimeAt) {
    let dateYm = moment.unix(createTimeAt).format(TableNameDateFormat);
    return `${BASE_TABLE_NAME}_${projectId}_${dateYm}`;
}
class UVService extends shard_1.BaseService {
    constructor() {
        super(...arguments);
        this.getExistUuidSetInHour = async (projectId, visitAt) => {
            let visitAtHour = moment.unix(visitAt).format(config_1.DATABASE_BY_HOUR);
            let tableName = getTableName(projectId, visitAt);
            let rawRecordList = await this.uvRepository
                .select('uuid')
                .from(tableName)
                .where('visit_at_hour', '=', visitAtHour)
                .catch(err => {
                this.log('获取指定小时内的uuid列表 => 出错' + err.message);
                return [];
            });
            let uuidSet = new Set();
            rawRecordList.forEach(rawRecord => {
                let uuid = _.get(rawRecord, ['uuid'], '');
                uuidSet.add(uuid);
            });
            return uuidSet;
        };
        this.replaceUvRecord = async (projectId, uuid, visitAt, country, province, city) => {
            let pvCount = 0;
            let visitAtHour = moment.unix(visitAt).format(config_1.DATABASE_BY_HOUR);
            let tableName = getTableName(projectId, visitAt);
            let updateAt = moment().unix();
            let oldRecordList = await this.uvRepository
                .select([`id`])
                .from(tableName)
                .where('uuid', '=', uuid)
                .andWhere('visit_at_hour', '=', visitAtHour)
                .catch(err => {
                this.log('replaceUvRecord => 出错' + err.message);
                return [];
            });
            let id = _.get(oldRecordList, [0, 'id'], 0);
            let data = {
                uuid,
                visit_at_hour: visitAtHour,
                pv_count: pvCount,
                country,
                province,
                city,
                update_time: updateAt,
            };
            let isSuccess = false;
            if (id > 0) {
                let affectRows = await this.uvRepository
                    .from(tableName)
                    .update(data)
                    .where(`id`, '=', id);
                isSuccess = affectRows > 0;
            }
            else {
                data['create_time'] = updateAt;
                let insertResult = await this.uvRepository
                    .returning('id')
                    .insert(data)
                    .into(tableName)
                    .catch(err => {
                    this.log('replaceUvRecord => 出错' + err.message);
                    return [];
                });
                let insertId = _.get(insertResult, [0], 0);
                isSuccess = insertId > 0;
            }
            return isSuccess;
        };
    }
}
__decorate([
    annotation_1.InjectRepositorys(),
    __metadata("design:type", Object)
], UVService.prototype, "uvRepository", void 0);
exports.UVService = UVService;

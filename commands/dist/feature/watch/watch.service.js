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
const shard_1 = require("../../shard");
const utils_1 = require("../../utils");
const BASE_TABLE_NAME = 't_o_alarm_config';
const TABLE_COLUMN = [
    `id`,
    `project_id`,
    `owner_ucid`,
    `error_type`,
    `error_name`,
    `time_range_s`,
    `max_error_count`,
    `alarm_interval_s`,
    `is_enable`,
    `note`,
    `is_delete`,
    `create_ucid`,
    `update_ucid`,
    `create_time`,
    `update_time`,
];
const DISPKAY_COLUMN = [
    `id`,
    `project_id`,
    `owner_ucid`,
    `error_type`,
    `error_name`,
    `time_range_s`,
    `max_error_count`,
    `alarm_interval_s`,
    `is_enable`,
    `note`,
    `create_ucid`,
    `update_ucid`,
    `create_time`,
    `update_time`,
];
function getTableName() {
    return BASE_TABLE_NAME;
}
class WatchService extends shard_1.BaseService {
    getAllEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.watchRepository()
                .from(getTableName())
                .select(TABLE_COLUMN)
                .where('is_delete', 0)
                .where('is_enable', 1)
                .catch(err => {
                this.log(err, '==================>获取报警配置总数出错_数据库_getAllEnabled');
                return [];
            });
            return result;
        });
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], WatchService.prototype, "watchRepository", void 0);
exports.WatchService = WatchService;

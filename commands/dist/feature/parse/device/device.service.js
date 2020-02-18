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
const BaseTableName = 't_r_system_collection';
function getTableName(projectId) {
    return `${BaseTableName}_${projectId}`;
}
class DeviceService extends shard_1.BaseService {
    getOldList(projectId, visitAtMonth, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = getTableName(projectId);
            let oldListResult = yield this.deviceRepository
                .from(table)
                .select('id')
                .where({ visit_at_month: visitAtMonth, uuid })
                .catch(err => {
                this.log('查询设备记录数据失败 => 出错' + err.message);
                return [];
            });
            return oldListResult;
        });
    }
    updataDevice(datas, projectId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = getTableName(projectId);
            let affectRows = yield this.deviceRepository(table)
                .where(`id`, '=', id)
                .update(datas)
                .catch(err => {
                this.log('更新查询设备记录数据失败 => 出错' + err.message);
                return 0;
            });
            return affectRows;
        });
    }
    createDevice(datas, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = getTableName(projectId);
            let createResultId = yield this.deviceRepository
                .insert(datas)
                .into(table)
                .catch(err => {
                this.log('创建设备数据记录数据失败 => 出错' + err.message);
                return 0;
            });
            return createResultId;
        });
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], DeviceService.prototype, "deviceRepository", void 0);
exports.DeviceService = DeviceService;
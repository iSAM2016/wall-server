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
const serviceBase_1 = require("../serviceBase");
const utils_1 = require("../../utils");
const BASE_TABLE_NAME = 't_r_project';
const TABLE_COLUMN = [
    `id`,
    `project_name`,
    `display_name`,
    `rate`,
    `c_desc`,
    `create_time`,
    `create_ucid`,
    `update_time`,
    `update_ucid`,
    `is_delete`,
];
const DISPLAY_TABLE_COLUMN = [
    `id`,
    `project_name`,
    `display_name`,
    `rate`,
    `c_desc`,
    `create_time`,
    `create_ucid`,
    `update_time`,
    `update_ucid`,
];
function getTableName() {
    return BASE_TABLE_NAME;
}
class ProjectService extends serviceBase_1.BaseService {
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            let tableName = getTableName();
            let projectList = yield this.uniqueViewRepository
                .select(TABLE_COLUMN)
                .from(tableName)
                .where('is_delete', 0)
                .catch(err => {
                this.log(`${this.constructor.name} => getlist => 出错` + err.message);
                return [];
            });
            let projectMap = {};
            for (let project of projectList) {
                projectMap[project.project_name] = {
                    id: project.id,
                    rate: project.rate,
                };
            }
            this.log('项目列表获取成功 =>', projectMap);
            return projectMap;
        });
    }
}
__decorate([
    utils_1.InjectRepositorys(),
    __metadata("design:type", Object)
], ProjectService.prototype, "uniqueViewRepository", void 0);
exports.ProjectService = ProjectService;

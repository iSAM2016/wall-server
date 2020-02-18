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
const typeorm_1 = require("typeorm");
let TRProject = class TRProject {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRProject.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "display_name", length: 50 }),
    __metadata("design:type", String)
], TRProject.prototype, "displayName", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "project_name", unique: true, length: 50 }),
    __metadata("design:type", String)
], TRProject.prototype, "projectName", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "c_desc", length: 100 }),
    __metadata("design:type", String)
], TRProject.prototype, "cDesc", void 0);
__decorate([
    typeorm_1.Column("int", { name: "rate", default: () => "'10000'" }),
    __metadata("design:type", Number)
], TRProject.prototype, "rate", void 0);
__decorate([
    typeorm_1.Column("tinyint", { name: "is_delete", width: 1, default: () => "'0'" }),
    __metadata("design:type", Boolean)
], TRProject.prototype, "isDelete", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "create_ucid", length: 20 }),
    __metadata("design:type", String)
], TRProject.prototype, "createUcid", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "update_ucid", length: 20 }),
    __metadata("design:type", String)
], TRProject.prototype, "updateUcid", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "create_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRProject.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "update_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRProject.prototype, "updateTime", void 0);
TRProject = __decorate([
    typeorm_1.Index("uniq_project_name", ["projectName"], { unique: true }),
    typeorm_1.Entity("t_r_project", { schema: "nest" })
], TRProject);
exports.TRProject = TRProject;

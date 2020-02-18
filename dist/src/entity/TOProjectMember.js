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
let TOProjectMember = class TOProjectMember {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TOProjectMember.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "project_id",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TOProjectMember.prototype, "projectId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "ucid", length: 20 }),
    __metadata("design:type", String)
], TOProjectMember.prototype, "ucid", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "role", length: 20 }),
    __metadata("design:type", String)
], TOProjectMember.prototype, "role", void 0);
__decorate([
    typeorm_1.Column("tinyint", {
        name: "need_alarm",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", Number)
], TOProjectMember.prototype, "needAlarm", void 0);
__decorate([
    typeorm_1.Column("tinyint", {
        name: "is_delete",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", Number)
], TOProjectMember.prototype, "isDelete", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "create_ucid", length: 20 }),
    __metadata("design:type", String)
], TOProjectMember.prototype, "createUcid", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "update_ucid", length: 20 }),
    __metadata("design:type", String)
], TOProjectMember.prototype, "updateUcid", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "create_time",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TOProjectMember.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "update_time",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TOProjectMember.prototype, "updateTime", void 0);
TOProjectMember = __decorate([
    typeorm_1.Entity("t_o_project_member", { schema: "nest" })
], TOProjectMember);
exports.TOProjectMember = TOProjectMember;

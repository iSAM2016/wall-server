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
let TRAlarmConfig = class TRAlarmConfig {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "project_id",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "projectId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "owner_ucid", length: 20 }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "ownerUcid", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "error_type", length: 20 }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "errorType", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "error_name", length: 255 }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "errorName", void 0);
__decorate([
    typeorm_1.Column("int", { name: "time_range_s", unsigned: true, default: () => "'0'" }),
    __metadata("design:type", Number)
], TRAlarmConfig.prototype, "timeRangeS", void 0);
__decorate([
    typeorm_1.Column("int", {
        name: "max_error_count",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", Number)
], TRAlarmConfig.prototype, "maxErrorCount", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "alarm_interval_s",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "alarmIntervalS", void 0);
__decorate([
    typeorm_1.Column("tinyint", {
        name: "is_enable",
        unsigned: true,
        default: () => "'1'"
    }),
    __metadata("design:type", Number)
], TRAlarmConfig.prototype, "isEnable", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "note", length: 255 }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "note", void 0);
__decorate([
    typeorm_1.Column("tinyint", {
        name: "is_delete",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", Number)
], TRAlarmConfig.prototype, "isDelete", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "create_ucid", length: 20 }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "createUcid", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "update_ucid", length: 20 }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "updateUcid", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "create_time",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "update_time",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TRAlarmConfig.prototype, "updateTime", void 0);
TRAlarmConfig = __decorate([
    typeorm_1.Entity("t_r_alarm_config", { schema: "nest" })
], TRAlarmConfig);
exports.TRAlarmConfig = TRAlarmConfig;

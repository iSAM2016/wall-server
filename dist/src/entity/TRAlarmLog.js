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
let TRAlarmLog = class TRAlarmLog {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "project_id",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "projectId", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "config_id", unsigned: true, default: () => "'0'" }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "configId", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "send_at", default: () => "'0'" }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "sendAt", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "error_type", length: 20 }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "errorType", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "error_name", length: 255 }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "errorName", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "message", length: 500 }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "message", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "create_time",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "update_time",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TRAlarmLog.prototype, "updateTime", void 0);
TRAlarmLog = __decorate([
    typeorm_1.Index("idx_send_at_project_id", ["sendAt", "projectId"], {}),
    typeorm_1.Entity("t_r_alarm_log", { schema: "nest" })
], TRAlarmLog);
exports.TRAlarmLog = TRAlarmLog;

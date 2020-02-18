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
let TRMonitor = class TRMonitor {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRMonitor.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "error_type", length: 20 }),
    __metadata("design:type", String)
], TRMonitor.prototype, "errorType", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "error_name", length: 255 }),
    __metadata("design:type", String)
], TRMonitor.prototype, "errorName", void 0);
__decorate([
    typeorm_1.Column("int", { name: "http_code", default: () => "'0'" }),
    __metadata("design:type", Number)
], TRMonitor.prototype, "httpCode", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "monitor_ext_id", default: () => "'0'" }),
    __metadata("design:type", String)
], TRMonitor.prototype, "monitorExtId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "during_ms", unsigned: true, default: () => "'0'" }),
    __metadata("design:type", Number)
], TRMonitor.prototype, "duringMs", void 0);
__decorate([
    typeorm_1.Column("int", {
        name: "request_size_b",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", Number)
], TRMonitor.prototype, "requestSizeB", void 0);
__decorate([
    typeorm_1.Column("int", {
        name: "response_size_b",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", Number)
], TRMonitor.prototype, "responseSizeB", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "url", length: 255 }),
    __metadata("design:type", String)
], TRMonitor.prototype, "url", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "country", length: 10 }),
    __metadata("design:type", String)
], TRMonitor.prototype, "country", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "province", length: 15 }),
    __metadata("design:type", String)
], TRMonitor.prototype, "province", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "city", length: 15 }),
    __metadata("design:type", String)
], TRMonitor.prototype, "city", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "log_at", default: () => "'0'" }),
    __metadata("design:type", String)
], TRMonitor.prototype, "logAt", void 0);
__decorate([
    typeorm_1.Column("char", { name: "md5", length: 32 }),
    __metadata("design:type", String)
], TRMonitor.prototype, "md5", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "create_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRMonitor.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "update_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRMonitor.prototype, "updateTime", void 0);
TRMonitor = __decorate([
    typeorm_1.Index("uniq_log_at_md5", ["logAt", "md5"], { unique: true }),
    typeorm_1.Index("idx_log_at_error_type_error_name_url", ["logAt", "errorType", "errorName", "url"], {}),
    typeorm_1.Entity("t_r_monitor", { schema: "nest" })
], TRMonitor);
exports.TRMonitor = TRMonitor;

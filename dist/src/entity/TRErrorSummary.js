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
let TRErrorSummary = class TRErrorSummary {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRErrorSummary.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "error_type", length: 20 }),
    __metadata("design:type", String)
], TRErrorSummary.prototype, "errorType", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "error_name", length: 255 }),
    __metadata("design:type", String)
], TRErrorSummary.prototype, "errorName", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "url_path", length: 255 }),
    __metadata("design:type", String)
], TRErrorSummary.prototype, "urlPath", void 0);
__decorate([
    typeorm_1.Column("bigint", {
        name: "city_distribution_id",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", String)
], TRErrorSummary.prototype, "cityDistributionId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "count_at_time", length: 20 }),
    __metadata("design:type", String)
], TRErrorSummary.prototype, "countAtTime", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "count_type", length: 10, default: () => "'day'" }),
    __metadata("design:type", String)
], TRErrorSummary.prototype, "countType", void 0);
__decorate([
    typeorm_1.Column("int", { name: "error_count", default: () => "'0'" }),
    __metadata("design:type", Number)
], TRErrorSummary.prototype, "errorCount", void 0);
__decorate([
    typeorm_1.Column("int", { name: "create_time", default: () => "'0'" }),
    __metadata("design:type", Number)
], TRErrorSummary.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("int", { name: "update_time", default: () => "'0'" }),
    __metadata("design:type", Number)
], TRErrorSummary.prototype, "updateTime", void 0);
TRErrorSummary = __decorate([
    typeorm_1.Index("idx_count_at_time_count_type_error_type_error_name", ["countAtTime", "countType", "errorType", "errorName"], {}),
    typeorm_1.Entity("t_r_error_summary", { schema: "nest" })
], TRErrorSummary);
exports.TRErrorSummary = TRErrorSummary;

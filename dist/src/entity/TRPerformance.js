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
let TRPerformance = class TRPerformance {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRPerformance.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "sum_indicator_value", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPerformance.prototype, "sumIndicatorValue", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "pv", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPerformance.prototype, "pv", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "indicator", length: 50 }),
    __metadata("design:type", String)
], TRPerformance.prototype, "indicator", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "url", length: 255 }),
    __metadata("design:type", String)
], TRPerformance.prototype, "url", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "city_distribute_id", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPerformance.prototype, "cityDistributeId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "count_at_time", length: 20 }),
    __metadata("design:type", String)
], TRPerformance.prototype, "countAtTime", void 0);
__decorate([
    typeorm_1.Column("varchar", {
        name: "count_type",
        length: 10,
        default: () => "'minute'"
    }),
    __metadata("design:type", String)
], TRPerformance.prototype, "countType", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "create_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPerformance.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "update_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPerformance.prototype, "updateTime", void 0);
TRPerformance = __decorate([
    typeorm_1.Index("idx_count_at_time_count_type_url_indicator", ["countAtTime", "countType", "url", "indicator"], {}),
    typeorm_1.Entity("t_r_performance", { schema: "nest" })
], TRPerformance);
exports.TRPerformance = TRPerformance;

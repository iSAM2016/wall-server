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
let TRPageView = class TRPageView {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRPageView.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "project_id", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPageView.prototype, "projectId", void 0);
__decorate([
    typeorm_1.Column("int", { name: "total_count", default: () => "'0'" }),
    __metadata("design:type", Number)
], TRPageView.prototype, "totalCount", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "count_at_time", length: 30 }),
    __metadata("design:type", String)
], TRPageView.prototype, "countAtTime", void 0);
__decorate([
    typeorm_1.Column("varchar", {
        name: "count_type",
        length: 20,
        default: () => "'hour'"
    }),
    __metadata("design:type", String)
], TRPageView.prototype, "countType", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "city_distribute_id", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPageView.prototype, "cityDistributeId", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "create_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPageView.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "update_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRPageView.prototype, "updateTime", void 0);
TRPageView = __decorate([
    typeorm_1.Index("uniq_project_id_count_type_count_at_time", ["projectId", "countType", "countAtTime"], { unique: true }),
    typeorm_1.Entity("t_r_page_view", { schema: "nest" })
], TRPageView);
exports.TRPageView = TRPageView;

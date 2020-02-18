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
let TRSystemRuntimeVersion = class TRSystemRuntimeVersion {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRSystemRuntimeVersion.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "project_id", default: () => "'0'" }),
    __metadata("design:type", String)
], TRSystemRuntimeVersion.prototype, "projectId", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "runtime_version", length: 50 }),
    __metadata("design:type", String)
], TRSystemRuntimeVersion.prototype, "runtimeVersion", void 0);
__decorate([
    typeorm_1.Column("int", { name: "total_count", unsigned: true, default: () => "'0'" }),
    __metadata("design:type", Number)
], TRSystemRuntimeVersion.prototype, "totalCount", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "count_at_month", length: 15 }),
    __metadata("design:type", String)
], TRSystemRuntimeVersion.prototype, "countAtMonth", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "city_distribute_id", default: () => "'0'" }),
    __metadata("design:type", String)
], TRSystemRuntimeVersion.prototype, "cityDistributeId", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "create_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRSystemRuntimeVersion.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "update_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRSystemRuntimeVersion.prototype, "updateTime", void 0);
TRSystemRuntimeVersion = __decorate([
    typeorm_1.Index("idx_project_id_count_at_month", ["projectId", "countAtMonth"], {}),
    typeorm_1.Entity("t_r_system_runtime_version", { schema: "nest" })
], TRSystemRuntimeVersion);
exports.TRSystemRuntimeVersion = TRSystemRuntimeVersion;

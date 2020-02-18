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
let TRUserFirstLoginAt = class TRUserFirstLoginAt {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'ucid', unique: true, length: 20 }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "ucid", void 0);
__decorate([
    typeorm_1.Column('bigint', { name: 'project_id', default: () => "'0'" }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "projectId", void 0);
__decorate([
    typeorm_1.Column('bigint', { name: 'first_visit_at', default: () => "'0'" }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "firstVisitAt", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'country', length: 10 }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "country", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'province', length: 15 }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "province", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'city', length: 15 }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "city", void 0);
__decorate([
    typeorm_1.Column('bigint', { name: 'create_time', default: () => "'0'" }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column('bigint', { name: 'update_time', default: () => "'0'" }),
    __metadata("design:type", String)
], TRUserFirstLoginAt.prototype, "updateTime", void 0);
TRUserFirstLoginAt = __decorate([
    typeorm_1.Entity('t_r_user_first_login_at', { schema: 'nest' })
], TRUserFirstLoginAt);
exports.TRUserFirstLoginAt = TRUserFirstLoginAt;

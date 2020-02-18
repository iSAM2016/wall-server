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
let TRUser = class TRUser {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true }),
    __metadata("design:type", String)
], TRUser.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "ucid", unique: true, length: 50 }),
    __metadata("design:type", String)
], TRUser.prototype, "ucid", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "account", unique: true, length: 50 }),
    __metadata("design:type", String)
], TRUser.prototype, "account", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "email", length: 50 }),
    __metadata("design:type", String)
], TRUser.prototype, "email", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "password_md5", length: 32 }),
    __metadata("design:type", String)
], TRUser.prototype, "passwordMd5", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "nickname", length: 20 }),
    __metadata("design:type", String)
], TRUser.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "role", length: 50, default: () => "'dev'" }),
    __metadata("design:type", String)
], TRUser.prototype, "role", void 0);
__decorate([
    typeorm_1.Column("varchar", {
        name: "register_type",
        length: 20,
        default: () => "'site'"
    }),
    __metadata("design:type", String)
], TRUser.prototype, "registerType", void 0);
__decorate([
    typeorm_1.Column("varchar", {
        name: "avatar_url",
        length: 200,
        default: () => "'http://ww1.sinaimg.cn/large/00749HCsly1fwofq2t1kaj30qn0qnaai.jpg'"
    }),
    __metadata("design:type", String)
], TRUser.prototype, "avatarUrl", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "mobile", length: 20 }),
    __metadata("design:type", String)
], TRUser.prototype, "mobile", void 0);
__decorate([
    typeorm_1.Column("tinyint", {
        name: "is_delete",
        unsigned: true,
        default: () => "'0'"
    }),
    __metadata("design:type", Number)
], TRUser.prototype, "isDelete", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "create_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRUser.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column("bigint", { name: "update_time", default: () => "'0'" }),
    __metadata("design:type", String)
], TRUser.prototype, "updateTime", void 0);
TRUser = __decorate([
    typeorm_1.Index("uniq_ucid", ["ucid"], { unique: true }),
    typeorm_1.Index("uniq_account", ["account"], { unique: true }),
    typeorm_1.Entity("t_r_user", { schema: "nest" })
], TRUser);
exports.TRUser = TRUser;

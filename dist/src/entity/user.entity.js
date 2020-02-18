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
const base_entity_1 = require("./base.entity");
let User = class User extends base_entity_1.default {
};
__decorate([
    typeorm_1.Column({ length: 50, default: '' }),
    __metadata("design:type", String)
], User.prototype, "ucid", void 0);
__decorate([
    typeorm_1.Column({ length: 50, default: '' }),
    __metadata("design:type", String)
], User.prototype, "account", void 0);
__decorate([
    typeorm_1.Column({ length: 20, default: '' }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    typeorm_1.Column({ length: 50, default: '' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ length: 32, default: '' }),
    __metadata("design:type", String)
], User.prototype, "password_md5", void 0);
__decorate([
    typeorm_1.Column({ length: 50, default: 'dev' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.Column({ length: 20, default: 'site' }),
    __metadata("design:type", String)
], User.prototype, "register_type", void 0);
__decorate([
    typeorm_1.Column({
        length: 200,
        default: 'http://ww1.sinaimg.cn/large/00749HCsly1fwofq2t1kaj30qn0qnaai.jpg',
    }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    typeorm_1.Column({ length: 20, default: '' }),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinyint', default: 0, width: 0, unsigned: true }),
    __metadata("design:type", Number)
], User.prototype, "is_delete", void 0);
User = __decorate([
    typeorm_1.Entity('user')
], User);
exports.User = User;

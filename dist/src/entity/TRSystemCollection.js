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
let TRSystemCollection = class TRSystemCollection {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'uuid', length: 50 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "uuid", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'browser', length: 50 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "browser", void 0);
__decorate([
    typeorm_1.Column('bigint', { name: 'project_id', default: () => "'0'" }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "projectId", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'browser_version', length: 100 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "browserVersion", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'engine', length: 100 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "engine", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'engine_version', length: 100 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "engineVersion", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'device_vendor', length: 100 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "deviceVendor", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'device_model', length: 100 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "deviceModel", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'os', length: 50 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "os", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'os_version', length: 50 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "osVersion", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'country', length: 10 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "country", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'province', length: 15 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "province", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'city', length: 15 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "city", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'runtime_version', length: 50 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "runtimeVersion", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'visit_at_month', length: 20 }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "visitAtMonth", void 0);
__decorate([
    typeorm_1.Column('bigint', { name: 'log_at', default: () => "'0'" }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "logAt", void 0);
__decorate([
    typeorm_1.Column('bigint', { name: 'create_time', default: () => "'0'" }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column('bigint', { name: 'update_time', default: () => "'0'" }),
    __metadata("design:type", String)
], TRSystemCollection.prototype, "updateTime", void 0);
TRSystemCollection = __decorate([
    typeorm_1.Entity('t_r_system_collection', { schema: 'nest' })
], TRSystemCollection);
exports.TRSystemCollection = TRSystemCollection;

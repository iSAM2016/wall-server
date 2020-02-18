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
let ProjectItem = class ProjectItem extends base_entity_1.default {
};
__decorate([
    typeorm_1.Column({}),
    __metadata("design:type", String)
], ProjectItem.prototype, "project_name", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], ProjectItem.prototype, "display_name", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], ProjectItem.prototype, "rate", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], ProjectItem.prototype, "c_desc", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], ProjectItem.prototype, "create_ucid", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], ProjectItem.prototype, "update_ucid", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinyint' }),
    __metadata("design:type", Number)
], ProjectItem.prototype, "is_delete", void 0);
ProjectItem = __decorate([
    typeorm_1.Entity('project_item')
], ProjectItem);
exports.ProjectItem = ProjectItem;

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
const entity_1 = require("../../../entity");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddProjectItemDto extends entity_1.ProjectItem {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddProjectItemDto.prototype, "project_name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddProjectItemDto.prototype, "display_name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AddProjectItemDto.prototype, "c_desc", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], AddProjectItemDto.prototype, "create_ucid", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], AddProjectItemDto.prototype, "update_ucid", void 0);
exports.AddProjectItemDto = AddProjectItemDto;
class ProjectItemDto extends entity_1.ProjectItem {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], ProjectItemDto.prototype, "id", void 0);
exports.ProjectItemDto = ProjectItemDto;
class ProjectItemListDto extends entity_1.ProjectItem {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], ProjectItemListDto.prototype, "offset", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], ProjectItemListDto.prototype, "limit", void 0);
exports.ProjectItemListDto = ProjectItemListDto;

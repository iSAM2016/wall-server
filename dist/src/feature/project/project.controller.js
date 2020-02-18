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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const project_service_1 = require("./project.service");
const swagger_1 = require("@nestjs/swagger");
let ProjectController = class ProjectController {
    constructor(ProjectService) {
        this.ProjectService = ProjectService;
    }
    async add(projectItem, req, res) {
        projectItem.is_delete = 0;
        projectItem.create_ucid = req.userId;
        let result = await this.ProjectService.addProjectItem(projectItem);
        res.status(common_1.HttpStatus.OK).json({
            message: '成功',
            status: common_1.HttpStatus.OK,
            result: result,
        });
    }
    async deleteItem(projectItemDeleteData, req, res) {
        projectItemDeleteData.create_ucid = req.userId;
        let result = await this.ProjectService.deleteProjectItem(projectItemDeleteData);
        res.status(common_1.HttpStatus.OK).json({
            message: '成功',
            status: common_1.HttpStatus.OK,
            result: result,
        });
    }
    async getItem(projectItemData, req, res) {
        let userId = req.userId;
        let result = await this.ProjectService.getProjectItem(projectItemData, userId);
        res.status(common_1.HttpStatus.OK).json({
            message: '成功',
            status: common_1.HttpStatus.OK,
            result: result,
        });
    }
    async getItemList(projectItemList, req, res) {
        let userId = req.userId;
        let result = await this.ProjectService.getProjectItemList(projectItemList, userId);
        res.status(common_1.HttpStatus.OK).json({
            message: '成功',
            status: common_1.HttpStatus.OK,
            result: result,
        });
    }
};
__decorate([
    common_1.Post('/item'),
    __param(0, common_1.Body()),
    __param(1, common_1.Request()),
    __param(2, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AddProjectItemDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "add", null);
__decorate([
    common_1.Delete('/item'),
    __param(0, common_1.Body()),
    __param(1, common_1.Request()),
    __param(2, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ProjectItemDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteItem", null);
__decorate([
    common_1.Get('/item'),
    __param(0, common_1.Body()),
    __param(1, common_1.Request()),
    __param(2, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ProjectItemDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getItem", null);
__decorate([
    common_1.Get('/item/list'),
    __param(0, common_1.Query()), __param(1, common_1.Request()), __param(2, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getItemList", null);
ProjectController = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiTags('project'),
    common_1.Controller('/api/project'),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
exports.ProjectController = ProjectController;

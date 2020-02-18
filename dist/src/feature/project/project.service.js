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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const projectItem_entity_1 = require("../../entity/projectItem.entity");
let ProjectService = class ProjectService {
    constructor(projectItemRepository) {
        this.projectItemRepository = projectItemRepository;
    }
    async addProjectItem(projectItemDto) {
        return await this.projectItemRepository.save(projectItemDto);
    }
    async deleteProjectItem(projectItemDelete) {
        const projectItem = await this.projectItemRepository.findOne(projectItemDelete);
        if (!projectItem) {
            throw new common_1.BadRequestException('没有此项目');
        }
        projectItem.is_delete = 1;
        return await this.projectItemRepository.save(projectItem);
    }
    async getProjectItem(projectItemData, userId) {
        const projectItem = await this.projectItemRepository.findOne({
            id: projectItemData.id,
            create_ucid: userId,
        });
        if (!projectItem) {
            throw new common_1.BadRequestException('没有此项目');
        }
        return await this.projectItemRepository.save(projectItem);
    }
    async getProjectItemList(getItemList, token) {
        const projectItemList = await this.projectItemRepository
            .createQueryBuilder()
            .where({ create_ucid: token })
            .skip(getItemList.offset)
            .take(getItemList.limit)
            .getManyAndCount();
        if (!projectItemList.length) {
            throw new common_1.BadRequestException('没有数据');
        }
        return projectItemList;
    }
};
ProjectService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(projectItem_entity_1.ProjectItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectService);
exports.ProjectService = ProjectService;

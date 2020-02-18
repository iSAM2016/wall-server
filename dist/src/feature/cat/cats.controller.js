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
const cat_dto_1 = require("./dto/cat.dto");
const cats_service_1 = require("./cats.service");
const cat_interface_1 = require("./cat.interface");
const validation_pipe_1 = require("../../core/pipes/validation.pipe");
const swagger_1 = require("@nestjs/swagger");
let CatsController = class CatsController {
    constructor(catsService) {
        this.catsService = catsService;
    }
    async create(createCatDto) {
        this.catsService.create(createCatDto);
    }
    async findAll(req) {
        console.log(req.cookies);
        return this.catsService.findAll();
    }
};
__decorate([
    common_1.Post(),
    swagger_1.ApiOperation({ summary: 'Create cat' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, common_1.Body(new validation_pipe_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cat_dto_1.CreateCatDto]),
    __metadata("design:returntype", Promise)
], CatsController.prototype, "create", null);
__decorate([
    common_1.Get(),
    swagger_1.ApiResponse({
        status: 200,
        description: 'The found record',
        type: cat_interface_1.Cat,
    }),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatsController.prototype, "findAll", null);
CatsController = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiTags('cats'),
    common_1.Controller('cats'),
    __metadata("design:paramtypes", [cats_service_1.CatsService])
], CatsController);
exports.CatsController = CatsController;

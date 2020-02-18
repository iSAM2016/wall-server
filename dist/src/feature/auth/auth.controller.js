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
const entity_1 = require("../../entity");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const auth_service_1 = require("./auth.service");
const config_service_1 = require("../../core/configure/config.service");
let AuthController = class AuthController {
    constructor(authService, config) {
        this.authService = authService;
        this.config = config;
    }
    async register(register) {
        return await this.authService.register(register);
    }
    async signUP(body) {
        return await this.authService.signUP(body);
    }
    async signIn(body, req, res) {
        let cookieInfo = await this.authService.signIn(body);
        const response = (req.session.authUser = cookieInfo);
        res.cookie('authUser', cookieInfo, {
            maxAge: +this.config.get('MAXAGE_MS'),
            signed: true,
        });
        delete response.password;
        return response;
    }
};
__decorate([
    common_1.Post('/register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entity_1.Register]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    swagger_1.ApiProperty(),
    common_1.Post('sign-up'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUP", null);
__decorate([
    swagger_1.ApiProperty(),
    common_1.Post('sign-in'),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignInDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
AuthController = __decorate([
    swagger_1.ApiTags('auth'),
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_service_1.ConfigService])
], AuthController);
exports.AuthController = AuthController;

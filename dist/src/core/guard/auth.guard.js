"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const entity_1 = require("../../entity");
const config_service_1 = require("../configure/config.service");
let RolesGuard = class RolesGuard {
    constructor() {
        this.errMissingAuthorization = new common_1.UnauthorizedException('Authorization Required');
        this.errInvalidBearer = new common_1.UnauthorizedException('Invalid Authorization Scheme');
        this.errInvalidToken = new common_1.UnauthorizedException('Invalid Authorization Token');
        this.required = true;
    }
    checkBearerLegal(request) {
        const authorization = request.get('authorization') || '';
        if (this.required && !authorization) {
            throw this.errMissingAuthorization;
        }
        const [bearer, token] = authorization.split(' ');
        if (this.required && bearer.toLowerCase() !== 'bearer') {
            throw this.errInvalidBearer;
        }
        if (this.required && !token) {
            throw this.errInvalidToken;
        }
        return token;
    }
    async checkUserExist(jwtDecoded) {
        let user;
        if (jwtDecoded && jwtDecoded.id) {
            user = await typeorm_1.getRepository(entity_1.User).findOne({
                id: jwtDecoded.id,
            }, {
                relations: ['profile', 'role'],
            });
        }
        if (user && !user) {
            throw this.errInvalidToken;
        }
        return user;
    }
    async canActivate(context) {
        let roles = [];
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (request.url === '/auth/sign-in' || request.url === '/auth/sign-up') {
            return true;
        }
        request.userId = 0;
        return true;
        let token = this.checkBearerLegal(request);
        const jwtDecoded = await util_1.promisify(jsonwebtoken_1.verify)(token, config_service_1.ConfigService.get('SYSTEM_SECRET')).catch(e => {
            if (this.required)
                throw new common_1.UnauthorizedException(e.message);
        });
        let user = await this.checkUserExist(jwtDecoded);
        request.user = user;
        return true;
    }
};
RolesGuard = __decorate([
    common_1.Injectable()
], RolesGuard);
exports.RolesGuard = RolesGuard;

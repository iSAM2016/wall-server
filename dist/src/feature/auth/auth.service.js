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
const utility = require("utility");
const typeorm_1 = require("typeorm");
const app_1 = require("../../../config/app");
const services_1 = require("../../shared/services");
const typeorm_2 = require("@nestjs/typeorm");
const bcryptjs_1 = require("bcryptjs");
const entity_1 = require("../../entity");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_service_1 = require("../../core/configure/config.service");
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
function encryptMD5(key) {
    return utility.md5(key);
}
let AuthService = class AuthService {
    constructor(registoryRepository, roleRepository, profileRepository, userRepository, config, mailService) {
        this.registoryRepository = registoryRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.config = config;
        this.mailService = mailService;
    }
    async register(register) {
        const { name } = register;
        const userExist = await this.registoryRepository.count({ name });
        if (userExist) {
            return {
                error: '用户名或邮箱已被使用。',
            };
        }
        const passhash = bcryptjs_1.hashSync(register.name, 10);
        try {
            const user = await this.registoryRepository.save({
                pass: passhash,
                name,
            });
            const token = encryptMD5(passhash + this.config.get('SYSTEM_SECRET'));
            this.mailService.sendActiveMail('ihailong@outlook.com', token, name);
            return {
                success: `欢迎加入 ${app_1.default.name}！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。`,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async signUP(body) {
        const { email, firstName } = body;
        const userRole = await this.userRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { firstName })
            .orWhere('user.email = :email', { email });
        if (userRole) {
            const errors = { username: 'Username and email must be unique.' };
            throw new http_exception_1.HttpException({ message: 'Input data validation failed', errors }, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = new entity_1.User();
        user.email = body.email;
        user.password_md5 = await bcryptjs_1.genSalt().then(s => bcryptjs_1.hash(body.password, s));
        const profile = new entity_1.Profile();
        profile.firstName = body.firstName;
        profile.lastName = body.lastName;
        try {
            this.userRepository.save(user);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
        try {
            this.profileRepository.save(profile);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async signIn(body) {
        const user = await this.userRepository.findOne({
            email: body.email,
        });
        if (!user)
            throw new common_1.BadRequestException('Email address does not exits');
        const isCorrectPassword = await bcryptjs_1.compare(body.password, user.password_md5);
        if (!isCorrectPassword) {
            throw new common_1.BadRequestException('Password is not correct.');
        }
        const accessToken = await jsonwebtoken_1.sign({
            id: user.id,
            email: user.email,
        }, this.config.get('SYSTEM_SECRET'), {
            expiresIn: +this.config.get('MAXAGE_MS'),
            issuer: 'API League Team',
        });
        return Object.assign(Object.assign({}, user), { accessToken });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(entity_1.Register)),
    __param(1, typeorm_2.InjectRepository(entity_1.Role)),
    __param(2, typeorm_2.InjectRepository(entity_1.Profile)),
    __param(3, typeorm_2.InjectRepository(entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        config_service_1.ConfigService,
        services_1.MailService])
], AuthService);
exports.AuthService = AuthService;

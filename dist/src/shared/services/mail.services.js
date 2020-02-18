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
const common_1 = require("@nestjs/common");
const mailer_server_1 = require("../../core/mailer/mailer.server");
const config_service_1 = require("../../core/configure/config.service");
let MailService = class MailService {
    constructor(mailer, configService) {
        this.mailer = mailer;
        this.configService = configService;
        this.name = 'CNode技术社区';
        this.host = `${this.configService.get('HOST')}:${this.configService.get('PORT')}`;
        this.from = `${this.name} <${this.configService.get('MAIL_USER')}>`;
    }
    sendActiveMail(to, token, username) {
        const name = this.name;
        const subject = `${name}帐号激活`;
        const html = `<p>您好：${username}</p>
    <p>我们收到您在${name}的注册信息，请点击下面的链接来激活帐户：</p>
    <a href="${this.host}/active_account?key=${token}&name=${username}">激活链接</a>
    <p>若您没有在${name}填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>
    <p>${name} 谨上。</p>`;
        this.mailer.send({
            from: this.from,
            to,
            subject,
            html,
        });
    }
};
MailService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [mailer_server_1.MailerService,
        config_service_1.ConfigService])
], MailService);
exports.MailService = MailService;

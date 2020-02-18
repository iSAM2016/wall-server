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
const rxjs_1 = require("rxjs");
const Mail = require("nodemailer/lib/mailer");
const mailer_constants_1 = require("./mailer.constants");
const operators_1 = require("rxjs/operators");
let MailerService = class MailerService {
    constructor(mailer) {
        this.mailer = mailer;
    }
    use(name, pluginFunc) {
        this.mailer.use(name, pluginFunc);
        return this;
    }
    set(key, handler) {
        this.mailer.set(key, handler);
        return this;
    }
    async send(mailMessage) {
        return await rxjs_1.from(this.mailer.sendMail(mailMessage)).pipe(handleRetry(), operators_1.tap(() => {
            this.mailer.close();
        }));
    }
    async findAll() { }
};
MailerService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(mailer_constants_1.MAILER_TOKEN)),
    __metadata("design:paramtypes", [Mail])
], MailerService);
exports.MailerService = MailerService;
function handleRetry(retryAttempts = 5, retryDelay = 3000) {
    return (source) => source.pipe(operators_1.retryWhen(e => e.pipe(operators_1.scan((errorCount, error) => {
        if (errorCount + 1 >= retryAttempts) {
            throw error;
        }
        return errorCount + 1;
    }, 0), operators_1.delay(retryDelay))));
}
exports.handleRetry = handleRetry;

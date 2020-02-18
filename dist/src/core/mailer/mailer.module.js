"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MailerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mailer_server_1 = require("./mailer.server");
const mailer_constants_1 = require("./mailer.constants");
const mailer_providers_1 = require("./mailer.providers");
let MailerModule = MailerModule_1 = class MailerModule {
    static forRoo(options) {
        return {
            module: MailerModule_1,
            providers: [
                { provide: mailer_constants_1.MAILER_MODULE_OPTIONS, useValue: options },
                mailer_providers_1.createMailerClient(),
                mailer_server_1.MailerService,
            ],
            exports: [mailer_server_1.MailerService],
        };
    }
    static forRootAsync(options) {
        return {
            module: MailerModule_1,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                mailer_providers_1.createMailerClient(),
                mailer_server_1.MailerService,
            ],
            exports: [mailer_server_1.MailerService],
        };
    }
    static createAsyncProviders(options) {
        if (options.useFactory) {
            return [this.createAsyncOptionsProviders(options)];
        }
    }
    static createAsyncOptionsProviders(options) {
        if (options.useFactory) {
            return {
                provide: mailer_constants_1.MAILER_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: mailer_constants_1.MAILER_MODULE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createMailerOptions(),
        };
    }
};
MailerModule = MailerModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], MailerModule);
exports.MailerModule = MailerModule;

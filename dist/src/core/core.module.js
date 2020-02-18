"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_module_1 = require("./configure/config.module");
const config_service_1 = require("./configure/config.service");
const mailer_module_1 = require("./mailer/mailer.module");
const schedule_1 = require("@nestjs/schedule");
let CoreModule = class CoreModule {
};
CoreModule = __decorate([
    common_1.Module({
        imports: [
            config_module_1.ConfigModule.register({ folder: '../../../' }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_module_1.ConfigModule, schedule_1.ScheduleModule.forRoot()],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: String(process.env.MYSQL_DB_HOST ? process.env.MYSQL_DB_HOST : 'localhost'),
                    port: Number(configService.get('MYSQL_PORT')),
                    username: configService.get('MYSQL_USER'),
                    password: configService.get('MYSQL_PASSWORD'),
                    database: configService.get('MYSQL_DATABASE'),
                    entities: [
                        'dist/src/entity/**.entity{.ts,.js}',
                        'dist/src/entity/**{.ts,.js}',
                    ],
                    logging: false,
                    entityPrefix: 'wall_',
                    synchronize: Boolean(configService.get('MYSQL_SYNCHRONIZE')),
                }),
                inject: [config_service_1.ConfigService],
            }),
            mailer_module_1.MailerModule.forRootAsync({
                imports: [config_module_1.ConfigModule],
                useFactory: async (configService) => ({
                    host: configService.get('MAIL_HOST'),
                    port: +configService.get('MAIL_PORT'),
                    secure: true,
                    secureConnection: true,
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASS'),
                    },
                    ignoreTLS: true,
                }),
                inject: [config_service_1.ConfigService],
            }),
        ],
        exports: [config_module_1.ConfigModule],
    })
], CoreModule);
exports.CoreModule = CoreModule;

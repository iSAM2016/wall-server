"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const nginx_service_1 = require("./nginx.service");
const _entity_1 = require("../../../entity");
const typeorm_1 = require("@nestjs/typeorm");
let NginxModule = class NginxModule {
};
NginxModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([_entity_1.TRProject])],
        exports: [nginx_service_1.NginxService],
        providers: [nginx_service_1.NginxService],
    })
], NginxModule);
exports.NginxModule = NginxModule;

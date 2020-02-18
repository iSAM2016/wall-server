"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mysql_module_1 = require("./mysql/mysql.module");
const service_module_1 = require("./services/service.module");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    common_1.Module({
        imports: [mysql_module_1.MysqlModule, service_module_1.ServicesModule],
        exports: [mysql_module_1.MysqlModule, service_module_1.ServicesModule],
    })
], SharedModule);
exports.SharedModule = SharedModule;

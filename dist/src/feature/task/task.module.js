"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const nginx_module_1 = require("./nginx/nginx.module");
const uv_module_1 = require("./uv/uv.module");
const device_module_1 = require("./device/device.module");
const menu_click_module_1 = require("./menu_click/menu_click.module");
const time_on_site_module_1 = require("./time_on_site/time_on_site.module");
const user_first_login_at_module_1 = require("./user_first_login_at/user_first_login_at.module");
let TaskModule = class TaskModule {
};
TaskModule = __decorate([
    common_1.Module({
        imports: [
            nginx_module_1.NginxModule,
            uv_module_1.UvModule,
            device_module_1.DeviceModule,
            menu_click_module_1.MenuClickModule,
            time_on_site_module_1.TimeOnSiteModule,
            user_first_login_at_module_1.UserFirstLoginAtModule,
        ],
        exports: [
            nginx_module_1.NginxModule,
            uv_module_1.UvModule,
            device_module_1.DeviceModule,
            menu_click_module_1.MenuClickModule,
            time_on_site_module_1.TimeOnSiteModule,
            user_first_login_at_module_1.UserFirstLoginAtModule,
        ],
    })
], TaskModule);
exports.TaskModule = TaskModule;

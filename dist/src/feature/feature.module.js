"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const cats_module_1 = require("./cat/cats.module");
const project_module_1 = require("./project/project.module");
const chat_module_1 = require("./chat/chat.module");
const task_module_1 = require("./task/task.module");
let FeatureModule = class FeatureModule {
};
FeatureModule = __decorate([
    common_1.Module({
        imports: [auth_module_1.AuthModule, cats_module_1.CatsModule, project_module_1.ProjectModule, chat_module_1.ChatModule, task_module_1.TaskModule],
        exports: [auth_module_1.AuthModule, cats_module_1.CatsModule, project_module_1.ProjectModule, chat_module_1.ChatModule, task_module_1.TaskModule],
    })
], FeatureModule);
exports.FeatureModule = FeatureModule;

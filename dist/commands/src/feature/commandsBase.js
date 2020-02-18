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
const _ = require("lodash");
const moment = require("moment");
const ace_1 = require("@adonisjs/ace");
const typescript_ioc_1 = require("typescript-ioc");
const core_1 = require("../core");
const config_1 = require("../config");
class CommandsBase extends ace_1.Command {
    constructor() {
        super();
        this.config = core_1.getConfig();
    }
    async log(...arg) {
        let message = '';
        arg.forEach(rawMessage => {
            if (_.isString(rawMessage) === false) {
                message = message + JSON.stringify(rawMessage);
            }
            else {
                message = message + rawMessage;
            }
        });
        let triggerAt = moment().format(config_1.DISPLAY_BY_MILLSECOND);
        console.log(`[${triggerAt}]-[${this.constructor.name}] ` + message);
        let infoMessage = `[${this.constructor.name}] ` + message;
        this.logger.getLogger4Command(this.constructor.name).info(infoMessage);
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", core_1.Logger)
], CommandsBase.prototype, "logger", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", core_1.Alert)
], CommandsBase.prototype, "alert", void 0);
exports.default = CommandsBase;

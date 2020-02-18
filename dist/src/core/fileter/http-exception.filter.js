"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        this.status = exception.getStatus();
        this.response = ctx.getResponse();
        this.request = ctx.getRequest();
        this.errorResponse = exception.getResponse();
        this.response.status(this.status).json(this.getMregeresponseMessage());
    }
    getMregeresponseMessage() {
        let responseMessage = {
            statusCode: this.status,
            timestamp: new Date().getTime().toString(),
        };
        switch (this.status) {
            case common_1.HttpStatus.UNAUTHORIZED:
                return Object.assign({
                    message: '非法用户',
                    path: '/login',
                }, responseMessage);
                break;
            case common_1.HttpStatus.BAD_REQUEST:
                return Object.assign({
                    message: this.errorResponse.message,
                    path: this.request.url,
                }, responseMessage);
            default:
                return Object.assign({
                    message: this.errorResponse.message,
                    path: this.request.url,
                }, responseMessage);
                break;
        }
    }
};
HttpExceptionFilter = __decorate([
    common_1.Catch(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;

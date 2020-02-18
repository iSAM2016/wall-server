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
const websockets_1 = require("@nestjs/websockets");
const auth_gateway_middleware_1 = require("./auth.gateway-middleware");
let AuthGateway = class AuthGateway {
    constructor() {
        this.logger = new common_1.Logger('AuthGateway');
    }
    async handleConnection(socket) {
        this.logger.log(`Socket ID: ${socket.id} connected!`);
    }
    async handleDisconnect(socket) {
        this.logger.log(`Socket ID: ${socket.id} disconnected!`);
    }
    async onWelcome(socket, data) {
        this.io.emit('WELCOME', `Welcome ${socket.id}.`);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], AuthGateway.prototype, "io", void 0);
__decorate([
    websockets_1.SubscribeMessage('WELCOME'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthGateway.prototype, "onWelcome", null);
AuthGateway = __decorate([
    websockets_1.WebSocketGateway({ namespace: 'auth', middlewares: [auth_gateway_middleware_1.AuthGatewayMiddleware] })
], AuthGateway);
exports.AuthGateway = AuthGateway;

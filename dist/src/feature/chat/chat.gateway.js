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
const websockets_1 = require("@nestjs/websockets");
const User_type_1 = require("../user/types/User.type");
const chat_service_1 = require("./chat.service");
const Message_type_1 = require("./types/Message.type");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    afterInit(server) { }
    handleConnection(socket) {
        this.socket = socket;
        process.nextTick(() => {
            socket.emit('allMessages', this.chatService.getMessages());
        });
    }
    handleDisconnect(socket) { }
    handleGetAddMessage(sender, message) {
        this.chatService.storeMessage(message);
        sender.emit('newMessage', message);
        sender.broadcast.emit('newMessage', message);
    }
    handleIsWriting(sender, user) {
        sender.broadcast.emit('isWriting', user);
    }
    handleIsNotWriting(sender) {
        sender.broadcast.emit('isNotWriting');
    }
};
__decorate([
    websockets_1.SubscribeMessage({ value: 'data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Message_type_1.Message]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleGetAddMessage", null);
__decorate([
    websockets_1.SubscribeMessage({ value: 'isWriting' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, User_type_1.User]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleIsWriting", null);
__decorate([
    websockets_1.SubscribeMessage({ value: 'isNotWriting' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleIsNotWriting", null);
ChatGateway = __decorate([
    websockets_1.WebSocketGateway({ port: 1080, namespace: 'messages' }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
exports.ChatGateway = ChatGateway;

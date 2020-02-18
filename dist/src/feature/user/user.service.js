"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let UserService = class UserService {
    constructor() {
        this.USERS = [];
        this.count = 0;
    }
    addUser(userName) {
        return new Promise((resolve, reject) => {
            if (this.USERS.find(user => user.name === userName)) {
                reject(userName);
            }
            else {
                let user = { id: ++this.count, name: userName };
                this.USERS.push(user);
                resolve(user);
            }
        });
    }
};
UserService = __decorate([
    common_1.Injectable()
], UserService);
exports.UserService = UserService;

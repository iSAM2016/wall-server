"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CatsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let CatsService = CatsService_1 = class CatsService {
    constructor() {
        this.logger = new common_1.Logger(CatsService_1.name);
        this.cats = [{ name: 'ui', age: 124, breed: 'io' }];
    }
    create(cat) {
        this.cats.push(cat);
    }
    findAll() {
        return this.cats;
    }
};
CatsService = CatsService_1 = __decorate([
    common_1.Injectable()
], CatsService);
exports.CatsService = CatsService;

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
const swagger_1 = require("@nestjs/swagger");
class Cat {
}
__decorate([
    swagger_1.ApiProperty({ example: 'Kitty', description: 'The name of the Cat' }),
    __metadata("design:type", String)
], Cat.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty({ example: 1, description: 'The age of the Cat' }),
    __metadata("design:type", Number)
], Cat.prototype, "age", void 0);
__decorate([
    swagger_1.ApiProperty({
        example: 'Maine Coon',
        description: 'The breed of the Cat',
    }),
    __metadata("design:type", String)
], Cat.prototype, "breed", void 0);
exports.Cat = Cat;

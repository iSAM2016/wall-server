"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Redis = require("ioredis");
const coreBase_1 = require("./coreBase");
class RedisClient extends coreBase_1.default {
    constructor() {
        super();
        this.redisClient = new Redis({
            port: this.config.get('REDIS_PORT'),
            host: this.config.get('REDIS_HOST'),
            retryStrategy: hasRetryTimes => {
                return false;
            },
            lazyConnect: true,
            showFriendlyErrorStack: true,
        });
        this._debounceDisconnect = _.debounce(() => __awaiter(this, void 0, void 0, function* () {
            if (this.checkIsConnected() === true) {
                yield this.redisClient.disconnect();
                this.log(`disconnect success! now connect status change to =>`);
            }
        }), 1 * 1000);
    }
    checkIsConnected() {
        let isConnected = _.get(this.redisClient, ['connector', 'connecting'], false);
        return isConnected;
    }
    _autoConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('connect: this.hasConnected =>');
            if (this.checkIsConnected() === false) {
                yield this.redisClient.connect();
                this.log(`connect success! now connect status change to =>`);
            }
        });
    }
    _autoDisconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._debounceDisconnect();
        });
    }
    asyncGet(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._autoConnect();
            let resultJson = yield this.redisClient.get(key).catch(e => {
                this.log('Redis异常=>');
                this.log(e);
                return '{}';
            });
            let result = JSON.parse(resultJson);
            yield this._autoDisconnect();
            return result;
        });
    }
    asyncSetex(key, expire, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._autoConnect();
            let valueJSON = JSON.stringify(value);
            let result = yield this.redisClient
                .setex(key, expire, valueJSON)
                .catch(e => {
                this.log('Redis异常=>');
                this.log(e);
            });
            yield this._autoDisconnect();
            return result;
        });
    }
}
exports.RedisClient = RedisClient;

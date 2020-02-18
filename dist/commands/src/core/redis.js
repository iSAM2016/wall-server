"use strict";
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
        this._debounceDisconnect = _.debounce(async () => {
            if (this.checkIsConnected() === true) {
                await this.redisClient.disconnect();
                this.log(`disconnect success! now connect status change to =>`);
            }
        }, 1 * 1000);
    }
    checkIsConnected() {
        let isConnected = _.get(this.redisClient, ['connector', 'connecting'], false);
        return isConnected;
    }
    async _autoConnect() {
        this.log('connect: this.hasConnected =>');
        if (this.checkIsConnected() === false) {
            await this.redisClient.connect();
            this.log(`connect success! now connect status change to =>`);
        }
    }
    async _autoDisconnect() {
        await this._debounceDisconnect();
    }
    async asyncGet(key) {
        await this._autoConnect();
        let resultJson = await this.redisClient.get(key).catch(e => {
            this.log('Redis异常=>');
            this.log(e);
            return '{}';
        });
        let result = JSON.parse(resultJson);
        await this._autoDisconnect();
        return result;
    }
    async asyncSetex(key, expire, value) {
        await this._autoConnect();
        let valueJSON = JSON.stringify(value);
        let result = await this.redisClient
            .setex(key, expire, valueJSON)
            .catch(e => {
            this.log('Redis异常=>');
            this.log(e);
        });
        await this._autoDisconnect();
        return result;
    }
}
exports.RedisClient = RedisClient;

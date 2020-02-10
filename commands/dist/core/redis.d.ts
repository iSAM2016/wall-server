import * as Redis from 'ioredis';
import CoreBase from './coreBase';
declare class RedisClient extends CoreBase {
    redisClient: Redis;
    _debounceDisconnect: Function;
    constructor();
    checkIsConnected(): any;
    _autoConnect(): Promise<void>;
    _autoDisconnect(): Promise<void>;
    asyncGet(key: any): Promise<any>;
    asyncSetex(key: any, expire: any, value: any): Promise<any>;
}
export { RedisClient };

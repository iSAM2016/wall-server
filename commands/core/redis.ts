import * as _ from 'lodash';
import * as Redis from 'ioredis';
import CoreBase from './coreBase';

class RedisClient extends CoreBase {
  redisClient: Redis;
  _debounceDisconnect: Function;
  constructor() {
    super();
    this.redisClient = new Redis({
      port: this.config.get('REDIS_PORT'),
      host: this.config.get('REDIS_HOST'),
      retryStrategy: hasRetryTimes => {
        // 关闭自动重连功能
        return false;
      },
      lazyConnect: true, // 初始化时不能连接Redis Server, 否则会因为无法断开连接, 导致npm run fee命令不能退出
      showFriendlyErrorStack: true,
    });
    // 利用debounce限制当连接空闲1s以上时, 自动断开链接, 避免由于持有连接句柄导致进程无法退出
    this._debounceDisconnect = _.debounce(async () => {
      if (this.checkIsConnected() === true) {
        await this.redisClient.disconnect();
        this.log(`disconnect success! now connect status change to =>`);
      }
    }, 1 * 1000);
  }
  checkIsConnected() {
    let isConnected = _.get(
      this.redisClient,
      ['connector', 'connecting'],
      false,
    );
    return isConnected;
  }
  /**
   * 自动重连
   */
  async _autoConnect() {
    this.log('connect: this.hasConnected =>');
    if (this.checkIsConnected() === false) {
      await this.redisClient.connect();
      this.log(`connect success! now connect status change to =>`);
    }
  }
  /**
   * 自动断开
   */
  async _autoDisconnect() {
    await this._debounceDisconnect();
  }
  /**
   * 取值
   * @param {String} key
   */
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
  /**
   * 设值
   * @param {String} key
   * @param {Number} expire
   * @param {String} value
   */
  async asyncSetex(key, expire, value) {
    await this._autoConnect();
    // 统一存入json后数据
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

export { RedisClient };

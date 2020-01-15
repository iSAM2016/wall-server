import { deviceConfigDevice } from '@commands/config';
/**
 * 数据清洗公共类
 * 读取对应配置 对parse第一清洗数据做，一致性、合法性校验
 * @class DataCleaning
 */
export class DataCleaning {
  /**
   * 构造方法
   *
   * @memberof constructor
   */
  constructor() {}
  // 简单的清洗方法
  // 返回值为true的时候代表可以入库，否则数据中存在非法数据
  getData(data, config) {
    let DataConfig = deviceConfigDevice[config];
    for (let key of Object.keys(DataConfig)) {
      if (!DataConfig[key].test(data[key])) {
        return false;
      }
    }
    return true;
  }
  /**
   * 迭代器方法，用于处理差异化清洗逻辑，
   *
   * @memberof iterator
   */
  iterator() {}
}

/**
 * 延迟执行函数, 返回一个 Promise
 * @param {number} ms
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

import { ConfigService } from '@core';
const prod = {
  WATCH_UCID_LIST_DEFAULT: [
    123456, // ***
  ],
};

// 测试环境下只给自己发就可以了
const development = {
  WATCH_UCID_LIST_DEFAULT: [
    123456, // ***
  ],
};

const ALERT_CONFIG = {
  development,
  prod,
};

let alertConfig = ALERT_CONFIG[ConfigService.get('NODE_ENV')];

export { alertConfig };

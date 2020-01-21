// 系统配置
import * as path from 'path';

let appPath = path.resolve(__dirname, '../../../'); // 项目 所在根路径
const appConfig = {
  name: '监控平台开发环境' || '',
  appPath,
  absoluteLogPath: path.resolve(appPath, 'log'), // log目录
};
export { appConfig };

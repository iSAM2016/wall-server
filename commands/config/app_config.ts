// 系统配置
import * as path from 'path';

let appPath = path.resolve(__dirname, '../../../'); // 项目 所在路径
const appConfig = {
  name: '监控平台开发环境',
  appPath,
  absoluteLogPath: path.resolve(appPath, 'log'),
  nginxLogFilePath: path.resolve(appPath, 'log'),
};
export { appConfig };

/* 跑批任务
 * @Author: isam2016
 * @Date: 2019-12-30 16:00:39
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 15:41:16
 */
import * as _ from 'lodash';
import * as moment from 'moment';
import * as ace from '@adonisjs/ace';
import { Alert, Logger } from './core';
import { DISPLAY_BY_MILLSECOND } from './config';
const registedCommandList = [
  './demo', //  命令demo

  // 解析日志
  './feature/parse/uv', //  解析uv
  './feature/parse/time_on_site', // 解析用户停留时长,
  './feature/parse/device', //  解析device
  //   './feature/parse/monitor', //  解析错误报警
  './feature/parse/menu_click', //  解析用户行为记录，不止click， 需要完善
  // './feature/parse/performance', //  解析性能统计指标数据
  './feature/parse/user_first_login_at', //  录入新增用户
  './feature/save_log/parseNginxLog', // 将ngnix日志落在文件中

  //   // 从数据库中, 按时间段统计
  //   './feature/summary/uv', //  统计uv数据
  //   './feature/summary/time_on_site', //  统计用户停留时长
  //   './feature/summary/system_os.js', // 按月统计系统分布, 每天跑
  //   './feature/summary/system_browser.js', // 按月统计浏览器分布, 每天跑
  //   './feature/summary/system_device.js', // 按月统计设备分布, 每天跑
  //   './feature/summary/system_runtime_version.js', // 按月统计版本分布，每天跑
  //   './feature/summary/http_error.js', // 按天统计http error分布, 每天跑
  //   './feature/summary/performance', //  按小时/天/月统计性能指标
  //   './feature/summary/new_user_summary', //  统计新增用户数
  //   './feature/summary/error_summary', // 统计某一错误的数量
  //   // 监控
  //   './feature/watch/saas', //  saas监控
  './feature/watch',

  //   './feature/create_cache/update_per_ten_minute', // 更新缓存

  //   // 任务调度
  './feature/task/manage',

  //   // 工具类命令
  './feature/sql', // 生成模板数据sql
  //   './feature/utils/clean_old_log', //  自动删除旧日志
  //   './feature/utils/test', //  专业粘贴调试代码

  //   // 测试uc
  //   './feature/utils/testUC',
];

// register feature
for (let command of registedCommandList) {
  ace.addCommand(require(command)['default']);
}
ace.onError(function(error, commandName) {
  let alert = new Alert();
  let logger = new Logger({});
  console.log('=========================');
  alert.sendMessage(
    String(this.config.get('ALERT_WATCH_UCID_LIST')),
    error.message,
  );
  let triggerAt = moment().format(DISPLAY_BY_MILLSECOND);
  console.log(`[${triggerAt}]-[${this.constructor.name}] ` + error.message);
  logger.getLogger4Command(this.constructor.name).info(error.message);
  process.exit(1); //退出程序
});

// Boot ace to execute commands
ace.wireUpWithCommander();
ace.invoke();

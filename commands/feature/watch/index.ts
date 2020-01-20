/* 监控
 * @Author: isam2016
 * @Date: 2020-01-20 09:02:51
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 12:05:34
 */

import * as moment from 'moment';

// import MMonitor from '~/src/model/parse/monitor';
// import WatchIdList from '~/src/configs/alarm';
// import Util from '~/src/library/utils/modules/util';
// import MProject from '~/src/model/project/project';
// import MProjectMember from '~/src/model/project/project_member';
import _ from 'lodash';
import CommandsBase from '../commandsBase';
import { CommandsModuleInterface } from 'commands/utils/interface';
import { sleep } from '@commands/utils';
import { Inject } from 'typescript-ioc';
import { WatchService } from './watch.service';
import { RedisClient } from '@commands/core';
const BASE_REDIS_KEY = 'plat_fe_fee_watch_alarm_';
const MAX_QUERY_COUNT = 10;
const MAX_SLEEP_COUNT = 60;

/**
 * @param {number} id 报警配置id
 */
function getRedisKey(id) {
  return BASE_REDIS_KEY + id;
}
class WatchAlarm extends CommandsBase implements CommandsModuleInterface {
  @Inject
  watchService: WatchService;
  @Inject
  redisClient: RedisClient;
  currentQueryCounter: number;
  constructor() {
    super();
    this.currentQueryCounter = 0;
  }

  static get signature() {
    return `
        WatchDog:Alarm
    `;
  }

  static get description() {
    return '[根据报警配置] 监测每一条报警配置对应的项目错误';
  }

  async handle(args, options) {
    try {
      const alarmConfigList = await this.watchService.getAllEnabled();
      for (let alarmConfig of alarmConfigList) {
        const {
          id,
          project_id: projectId,
          error_name: errorName,
          time_range_s: timeRange,
          max_error_count: maxErrorCount,
          alarm_interval_s: alarmInterval,
          note,
        } = alarmConfig;
        const redisKey = getRedisKey(id);
        const hasAlertInAlarmInterval = await this.redisClient.asyncGet(
          redisKey,
        );
        if (hasAlertInAlarmInterval) {
          this.log(
            `项目${projectId}监听的${errorName}错误在${timeRange}秒内报警过，自动跳过`,
          );
        } else {
          let waitForDispatch = true;
          let sleepCounter = 0;
          while (waitForDispatch) {
            if (this.currentQueryCounter < MAX_QUERY_COUNT) {
              this.autoAlarm(
                projectId,
                errorName,
                timeRange,
                maxErrorCount,
                alarmInterval,
                redisKey,
                note,
                id,
              )
                .then(() => {
                  this.currentQueryCounter = this.currentQueryCounter - 1;
                })
                .catch(() => {
                  this.currentQueryCounter = this.currentQueryCounter - 1;
                });
              this.currentQueryCounter = this.currentQueryCounter + 1;
              waitForDispatch = false;
            } else {
              sleepCounter = sleepCounter + 1;
              if (sleepCounter > MAX_SLEEP_COUNT) {
                const sleepMinutes = sleepCounter / 60;
                await this.alert.sendMessage(
                  `报警系统数据库查询已经睡眠${sleepMinutes}分钟，可能出问题了。`,
                );
              }
              await sleep(1000);
            }
          }
        }
      }
    } catch (error) {}
  }

  async autoAlarm(
    projectId,
    errorName,
    timeRange,
    maxErrorCount,
    alarmInterval,
    redisKey,
    note,
    configId,
  ) {
    const nowAt = moment().unix();
    const timeAgoAt = nowAt - timeRange;
    // const errorCount = await MMonitor.getErrorCountForAlarm(
    //   projectId,
    //   errorName,
    //   timeAgoAt,
    //   nowAt,
    // );
    // this.log(
    //   `项目${projectId}监控的${errorName}错误最近${timeRange}秒错误数 => ${errorCount}`,
    // );
    // // 指定时间内报错数大于MaxErrorCount, 则报警
    // if (errorCount >= maxErrorCount) {
    //   const project = await MProject.get(projectId);
    //   const projectName = _.get(project, ['display_name'], projectId);
    //   const projectRate = (_.get(project, ['rate'], 0) / 10000) * 100;
    //   const alarmUcidList = await MProjectMember.getAlarmUcidList(projectId);
    //   const nowAt = moment().unix();
    //   if (errorName === '*') {
    //     errorName = '所有';
    //   }
    //   let alarmMsg = `项目【${projectName}】监控的【${errorName}】错误，抽样比例【${projectRate}%】 最近【${timeRange}】秒内错误数【${errorCount}】, 达到阈值【${maxErrorCount}】,触发报警, 报警备注【${note}】。`;
    //   this.log(alarmMsg);
    //   await this.sendAlert(alarmUcidList, alarmMsg);
    //   const isSuccess = await MAlarmLog.insert(
    //     projectId,
    //     configId,
    //     nowAt,
    //     errorName,
    //     alarmMsg,
    //   );
    //   if (isSuccess === false) {
    //     Logger.error('添加报警日志失败');
    //   }
    //   await redis.asyncSetex(redisKey, alarmInterval, 1);
  }
}

export default WatchAlarm;

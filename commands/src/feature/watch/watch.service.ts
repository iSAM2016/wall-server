import * as _ from 'lodash';
import * as moment from 'moment';
import { BaseService } from '@app/shard';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@app/config';
import { InjectRepositorys } from '@app/utils';

const BASE_TABLE_NAME = 't_o_alarm_config';
const TABLE_COLUMN = [
  `id`,
  `project_id`,
  `owner_ucid`,
  `error_type`,
  `error_name`,
  `time_range_s`,
  `max_error_count`,
  `alarm_interval_s`,
  `is_enable`,
  `note`,
  `is_delete`,
  `create_ucid`,
  `update_ucid`,
  `create_time`,
  `update_time`,
];
const DISPKAY_COLUMN = [
  `id`,
  `project_id`,
  `owner_ucid`,
  `error_type`,
  `error_name`,
  `time_range_s`,
  `max_error_count`,
  `alarm_interval_s`,
  `is_enable`,
  `note`,
  `create_ucid`,
  `update_ucid`,
  `create_time`,
  `update_time`,
];
function getTableName() {
  return BASE_TABLE_NAME;
}

export class WatchService extends BaseService {
  @InjectRepositorys()
  private readonly watchRepository;

  /**
   * 获取所有可用的配置（内部使用）
   */
  async getAllEnabled() {
    const result = await this.watchRepository()
      .from(getTableName())
      .select(TABLE_COLUMN)
      .where('is_delete', 0)
      .where('is_enable', 1)
      .catch(err => {
        this.log(
          err,
          '==================>获取报警配置总数出错_数据库_getAllEnabled',
        );
        return [];
      });
    return result;
  }
}

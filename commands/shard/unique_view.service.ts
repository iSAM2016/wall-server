import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
import { InjectRepositorys } from 'commands/utils/annotation';
import { Repository } from 'typeorm';

export class UniqueViewService {
  @InjectRepositorys()
  private readonly uniqueViewRepository;

  /**
   * 获取记录
   */
  async getRecord(projectId, countAtTime, countType) {
    // let recordList = await Knex
    let recordList = await (await this.uniqueViewRepository)
      .createQueryBuilder()
      .where({ project_id: projectId })
      .andWhere('count_at_time=:countAtTime', countAtTime)
      .andWhere('count_type=:countType', countType)
      .getMany();
    //   .catch(e => {
    //     return []
    //   })
    return _.get(recordList, [0], {});
  }

  /**
   * 获取总uv, 记录不存在返回0
   * @param {number} projectId
   * @param {string} countAtTime
   * @param {string} countType
   * @return {number}
   */
  async getTotalUv(projectId, countAtTime, countType) {
    let record = await this.getRecord(projectId, countAtTime, countType);
    return _.get(record, ['total_count'], 0);
  }
}

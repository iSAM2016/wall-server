import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorDistribution } from '@entity';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
import { Repository } from 'typeorm';
import { InjectRepositorys } from 'commands/utils/annotation';

export class BehaviorDistributionService {
  @InjectRepositorys(BehaviorDistribution)
  private readonly behaviorDistributionRepository: Repository<
    BehaviorDistribution
  >;
  /**
   * 自动创建&更新, 并增加total_stay_ms的值
   * @param {number} projectId
   * @param {string} code
   * @param {string} name
   * @param {string} url
   * @param {number} totalCount
   * @param {number} countAtTime
   * @param {string} countType
   * @param {object} cityDistribute
   * @return {boolean}
   */
  async replaceRecord(
    projectId,
    code,
    name,
    url,
    totalCount,
    countAtTime,
    countType,
    cityDistribute,
  ) {
    let oldRecordList = await (await this.behaviorDistributionRepository)
      .createQueryBuilder()
      .where('project_id = :projectId', projectId)
      .andWhere('count_at_time = :countAtTime', countAtTime)
      .andWhere('code = :code', code)
      .andWhere('count_type = :countType', countType)
      .getMany();
    return oldRecordList;
  }
  updateBehavior = async (id, data) => {
    // 返回值是一个列表
    let result = await (await this.behaviorDistributionRepository).findOne({
      id,
    });

    let updateResult = await (await this.behaviorDistributionRepository)
      .save({ ...result, ...data })
      .catch(e => {
        return [];
      });
    return updateResult;
  };
  /**
   * 插入数据
   * @param id
   * @param data
   */
  async insertDuration(data) {
    // 返回值是一个列表
    let result = await (await this.behaviorDistributionRepository)
      .save(data)
      .catch(e => {
        return {};
      });
    return result;
  }
}

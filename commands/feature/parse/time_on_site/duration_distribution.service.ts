import * as _ from 'lodash';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { DurationDistribution } from '@entity';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
import { InjectRepositorys } from 'commands/utils/annotation';

export class DurationDistributionService {
  @InjectRepositorys(DurationDistribution)
  private readonly durationDistributionRepository: Repository<
    DurationDistribution
  >;

  /**
   * 自动创建/替换总uv记录
   */
  replaceUvRecord = async (projectId, countAtTime, countType) => {
    // 返回值是一个列表
    let oldRecordList = await (await this.durationDistributionRepository)
      .createQueryBuilder()
      .where({ projectId })
      .andWhere('count_at_time = :countAtTime', countAtTime)
      .andWhere('count_type = :countType', countType)
      .getMany()
      .catch(e => {
        return [];
      });
    // let oldRecordList = await Knex.select([//TODO:
    //   `city_distribute_id`,
    //   `create_time`,
    //   `id`,
    // ])
    return oldRecordList;
  };
  /**
   *更新
   *
   * @memberof DurationDistributionService
   */
  updateDuration = async (id, data) => {
    // 返回值是一个列表
    let result = await (await this.durationDistributionRepository).findOne({
      id,
    });

    let updateResult = await (await this.durationDistributionRepository)
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
    let result = await (await this.durationDistributionRepository)
      .save(data)
      .catch(e => {
        return {};
      });
    return result;
  }
}

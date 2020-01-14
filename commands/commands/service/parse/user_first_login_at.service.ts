import * as _ from 'lodash';
import * as moment from 'moment';
import { UserFirstLoginAt } from '@entity';
import { Repository } from 'typeorm';
import { InjectRepositorys } from '@annotation';

export class UserFirstLoginAtService {
  @InjectRepositorys(UserFirstLoginAt)
  private readonly userFirstLoginAtRepository: Repository<UserFirstLoginAt>;
  /**
   * 过滤所有已存在在数据库中的ucid(使用Set, 以便区分Map和Object)
   * @param {*} projectId
   * @param {*} allUcidList
   * @returns {object}
   */
  async filterExistUcidSetInDb(projectId, allUcidList) {
    // let rawRecordList = await (await this.userFirstLoginAtRepository).whereIn(
    //   'ucid',
    //   allUcidList,
    // );
    let rawRecordList = [];
    let existUcidSet = new Set();
    for (let rawRecord of rawRecordList) {
      let ucid = _.get(rawRecord, ['ucid'], '');
      existUcidSet.add(ucid);
    }
    return existUcidSet;
  }
  /**
   * 若数据库中记录的最早登陆时间比传入值更晚, 则更新为传入的更新时间
   * @param {number} projectId
   * @param {string} ucid
   * @param {number} visitAt
   * @param {number} pvCount
   * @param {string} country
   * @param {string} province
   * @param {string} city
   * @return {boolean}
   */
  async replaceInto(projectId, ucid, firstVisitAt, country, province, city) {
    let updateAt = moment().unix();
    // 返回值是一个列表
    let oldRecordList = await (await this.userFirstLoginAtRepository)
      .createQueryBuilder()
      .where('ucid = :ucid', ucid);

    // 利用get方法, 不存在直接返回0, 没毛病
    let id = _.get(oldRecordList, [0, 'id'], 0);
    let oldFirstVisitAt = _.get(oldRecordList, [0, 'first_visit_at'], 0);
    let data = {
      ucid,
      first_visit_at: firstVisitAt,
      country,
      province,
      city,
      update_time: updateAt,
    };
    let isSuccess = false;
    if (id > 0) {
      if (oldFirstVisitAt > 0 && oldFirstVisitAt > firstVisitAt) {
        // 有更新的数据时更新一下
        let result = await (await this.userFirstLoginAtRepository).findOne(
          `id = :id`,
          id,
        );
        let affectRows = await (await this.userFirstLoginAtRepository).save({
          ...result,
          ...data,
        });
        // isSuccess = affectRows > 0; // TODO:
      } else {
        return true;
      }
    } else {
      data['create_time'] = updateAt;
      let insertResult = await (await this.userFirstLoginAtRepository)
        .save(data)
        .catch(e => {
          return [];
        });
      let insertId = _.get(insertResult, [0], 0);
      isSuccess = insertId > 0;
    }
    return isSuccess;
  }
  /**
   * 插入数据
   * @param id
   * @param data
   */
  async insertDuration(data) {
    // 返回值是一个列表
    let result = await (await this.userFirstLoginAtRepository)
      .save(data)
      .catch(e => {
        return {};
      });
    return result;
  }
}

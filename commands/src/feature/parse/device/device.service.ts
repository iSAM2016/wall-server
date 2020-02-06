import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_UNIT, UNIT } from '@app/config';
import { InjectRepositorys } from '@app/utils';
import { BaseService } from '@app/shard';

const BaseTableName = 't_r_system_collection';
function getTableName(projectId) {
  return `${BaseTableName}_${projectId}`;
}

/*
 * 用户停留时长分布， 按天和月进行统计
 * 当前项目 当前统计尺度下 记录用户停留总秒数 同时记录城市分布情况
 *
 */
export class DeviceService extends BaseService {
  @InjectRepositorys()
  private readonly deviceRepository;

  /**
   * 查询设备记录
   * @param projectId
   * @param visitAtMonth
   * @param uuid 设备号
   */
  async getOldList(projectId, visitAtMonth, uuid) {
    const table = getTableName(projectId);
    let oldListResult = await this.deviceRepository
      .from(table)
      .select('id')
      .where({ visit_at_month: visitAtMonth, uuid })
      .catch(err => {
        this.log('查询设备记录数据失败 => 出错' + err.message);
        return [];
      });
    return oldListResult;
  }
  /**
   * 更新数据
   * @param datas
   * @param projectId
   * @param visitAtMonth
   */
  async updataDevice(datas, projectId, id) {
    const table = getTableName(projectId);
    let affectRows = await this.deviceRepository(table)
      .where(`id`, '=', id)
      .update(datas)
      .catch(err => {
        this.log('更新查询设备记录数据失败 => 出错' + err.message);
        return 0;
      });
    return affectRows;
  }
  /**
   * 创建设备数据
   * @param datas
   * @param projectId
   */
  async createDevice(datas, projectId) {
    const table = getTableName(projectId);
    let createResultId = await this.deviceRepository
      .insert(datas)
      .into(table)
      .catch(err => {
        this.log('创建设备数据记录数据失败 => 出错' + err.message);
        return 0;
      });
    return createResultId;
  }
}

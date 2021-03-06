/* 项目模块
 * @Author: isam2016
 * @Date: 2020-01-15 16:29:48
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-02-21 10:48:52
 */
import * as _ from 'lodash';
import { TRProject } from '@entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(TRProject)
    private readonly projectRepository: Repository<TRProject>,
  ) {}
  private readonly logger = new Logger(ProjectService.name);

  /**
   * 项目列表
   */
  async getList() {
    let projectList = await this.projectRepository
      .createQueryBuilder()
      .where({ is_delete: 0 })
      .getMany();
    let projectMapSet = new Map();
    for (let project of projectList) {
      projectMapSet.set(project.projectName, project);
    }
    let projectIdList = projectList.map(_ => _.id);
    this.logger.log(`项目列表ID获取成功 => ${projectIdList.join(',')}`);
    return projectMapSet;
  }
  // /**
  //  * 获取总uv, 记录不存在返回0
  //  * @param {number} projectId
  //  * @param {string} countAtTime
  //  * @param {string} countType
  //  * @return {number}
  //  */
  // async getTotalUv(projectId, countAtTime, countType) {
  //   let record = await this.getRecord(projectId, countAtTime, countType);
  //   return _.get(record, ['total_count'], 0);
  // }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectItem } from '../../entity/projectItem.entity';
import { AddProjectItemDto } from './dto/projectItem';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectItem)
    private readonly projectItemRepository: Repository<ProjectItem>,
  ) {}

  async addProjectItem(
    projectItemDto: AddProjectItemDto,
  ): Promise<ProjectItem> {
    return await this.projectItemRepository.save(projectItemDto);
  }

  async deleteProjectItem(projectItemDelete): Promise<ProjectItem> {
    const projectItem = await this.projectItemRepository.findOne(
      projectItemDelete,
    );
    if (!projectItem) {
      throw new BadRequestException('没有此项目');
    }
    projectItem.is_delete = 1;
    return await this.projectItemRepository.save(projectItem);
  }

  async getProjectItem(projectItemData, userId): Promise<ProjectItem> {
    const projectItem = await this.projectItemRepository.findOne({
      id: projectItemData.id,
      create_ucid: userId,
    });
    if (!projectItem) {
      throw new BadRequestException('没有此项目');
    }
    return await this.projectItemRepository.save(projectItem);
  }

  async getProjectItemList(
    getItemList,
    token,
  ): Promise<[Array<ProjectItem>, number]> {
    const projectItemList = await this.projectItemRepository
      .createQueryBuilder()
      .where({ create_ucid: token })
      .skip(getItemList.offset)
      // .andWhere('(photo.name = :photoName OR photo.name = :bearName)')
      .take(getItemList.limit)
      .getManyAndCount();

    if (!projectItemList.length) {
      throw new BadRequestException('没有数据');
    }
    return projectItemList;
  }
}

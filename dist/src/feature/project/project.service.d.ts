import { Repository } from 'typeorm';
import { ProjectItem } from '../../entity/projectItem.entity';
import { AddProjectItemDto } from './dto/projectItem';
export declare class ProjectService {
    private readonly projectItemRepository;
    constructor(projectItemRepository: Repository<ProjectItem>);
    addProjectItem(projectItemDto: AddProjectItemDto): Promise<ProjectItem>;
    deleteProjectItem(projectItemDelete: any): Promise<ProjectItem>;
    getProjectItem(projectItemData: any, userId: any): Promise<ProjectItem>;
    getProjectItemList(getItemList: any, token: any): Promise<[Array<ProjectItem>, number]>;
}

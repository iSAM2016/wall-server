import { AddProjectItemDto, ProjectItemDto } from './dto';
import { ProjectService } from './project.service';
export declare class ProjectController {
    private readonly ProjectService;
    constructor(ProjectService: ProjectService);
    add(projectItem: AddProjectItemDto, req: any, res: any): Promise<void>;
    deleteItem(projectItemDeleteData: ProjectItemDto, req: any, res: any): Promise<void>;
    getItem(projectItemData: ProjectItemDto, req: any, res: any): Promise<void>;
    getItemList(projectItemList: any, req: any, res: any): Promise<void>;
}

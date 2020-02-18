import { ProjectItem } from '../../../entity';
export declare class AddProjectItemDto extends ProjectItem {
    project_name: string;
    display_name: string;
    c_desc: string;
    create_ucid: number;
    update_ucid: number;
    is_delete: number;
}
export declare class ProjectItemDto extends ProjectItem {
    readonly id: number;
}
export declare class ProjectItemListDto extends ProjectItem {
    offset: number;
    limit: number;
}

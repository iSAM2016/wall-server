import { ProjectItem } from '../../../entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Length, IsString, Min, Max } from 'class-validator';

export class AddProjectItemDto extends ProjectItem {
  @ApiProperty()
  @IsString()
  // @Min(20)
  // @Max(3)
  project_name: string;

  @ApiProperty()
  @IsString()
  display_name: string;

  @ApiProperty()
  @IsString()
  c_desc: string;

  @ApiProperty()
  @IsInt()
  create_ucid: number;

  @ApiProperty()
  @IsInt()
  update_ucid: number;

  is_delete: number;
}

export class ProjectItemDto extends ProjectItem {
  @ApiProperty()
  @IsInt()
  readonly id: number;
}

export class ProjectItemListDto extends ProjectItem {
  @ApiProperty()
  @IsInt()
  offset: number;

  @ApiProperty()
  @IsInt()
  limit: number;
}

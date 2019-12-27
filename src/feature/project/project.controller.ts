import {
  Controller,
  Get,
  Post,
  Body,
  Response,
  Request,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { AddProjectItemDto, ProjectItemDto, ProjectItemListDto } from './dto';
import { ProjectService } from './project.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly ProjectService: ProjectService) {}

  @Post('/item')
  async add(
    @Body() projectItem: AddProjectItemDto,
    @Request() req,
    @Response() res,
  ) {
    projectItem.is_delete = 0;
    projectItem.create_ucid = req.userId;
    let result = await this.ProjectService.addProjectItem(projectItem);
    res.status(HttpStatus.OK).json({
      message: '成功',
      status: HttpStatus.OK,
      result: result,
    });
  }

  @Delete('/item')
  async deleteItem(
    @Body() projectItemDeleteData: ProjectItemDto,
    @Request() req,
    @Response() res,
  ) {
    projectItemDeleteData.create_ucid = req.userId;
    let result = await this.ProjectService.deleteProjectItem(
      projectItemDeleteData,
    );
    res.status(HttpStatus.OK).json({
      message: '成功',
      status: HttpStatus.OK,
      result: result,
    });
  }

  @Get('/item')
  async getItem(
    @Body() projectItemData: ProjectItemDto,
    @Request() req,
    @Response() res,
  ) {
    let userId = req.userId;
    let result = await this.ProjectService.getProjectItem(
      projectItemData,
      userId,
    );
    res.status(HttpStatus.OK).json({
      message: '成功',
      status: HttpStatus.OK,
      result: result,
    });
  }

  @Get('/itemlist')
  async getItemList(
    @Body() projectItemList: ProjectItemListDto,
    @Request() req,
    @Response() res,
  ) {
    let userId = req.userId;
    let result = await this.ProjectService.getProjectItemList(
      projectItemList,
      userId,
    );
    res.status(HttpStatus.OK).json({
      message: '成功',
      status: HttpStatus.OK,
      result: result,
    });
  }
}

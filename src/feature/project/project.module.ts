import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectItem } from '../../entity/projectItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectItem])],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}

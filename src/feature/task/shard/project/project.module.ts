import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TRProject } from '@entity';
@Module({
  imports: [TypeOrmModule.forFeature([TRProject])],
  exports: [ProjectService],
  providers: [ProjectService],
})
export class ProjectModule {}

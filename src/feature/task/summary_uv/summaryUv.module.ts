import { Module } from '@nestjs/common';
import { SummaryUvService } from './summaryUv.service';
import { ProjectModule } from '../shard/project/project.module';
@Module({
  imports: [ProjectModule],
  exports: [SummaryUvService],
  providers: [SummaryUvService],
})
export class SummaryUvModule {}

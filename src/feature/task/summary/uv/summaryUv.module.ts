import { Module } from '@nestjs/common';
import { UvModule } from '../../uv/uv.module';
import { SummaryUvService } from './summaryUv.service';
import { ProjectModule } from '../../shard/project/project.module';
import { UniqueViewModule, CityDistributionModule } from '../../shard';
@Module({
  imports: [ProjectModule, UniqueViewModule, CityDistributionModule, UvModule],
  exports: [SummaryUvService],
  providers: [SummaryUvService],
})
export class SummaryUvModule {}

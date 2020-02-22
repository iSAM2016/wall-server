import { Module } from '@nestjs/common';
import { SummaryTimeOnSiteService } from './time_on_site.service';
import { ProjectModule } from '../../shard/project/project.module';
import { UniqueViewModule, CityDistributionModule } from '../../shard';
import { TimeOnSiteModule } from '../../time_on_site/time_on_site.module';
@Module({
  imports: [
    ProjectModule,
    UniqueViewModule,
    CityDistributionModule,
    TimeOnSiteModule,
  ],
  exports: [SummaryTimeOnSiteService],
  providers: [SummaryTimeOnSiteService],
})
export class SummaryTimeOnSiteModule {}

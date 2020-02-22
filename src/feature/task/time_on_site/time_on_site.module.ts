import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeOnSiteService } from './time_on_site.service';
import { UniqueViewModule, CityDistributionModule } from '../shard/';
import {
  TRDurationDistribution,
  TRCityDistribution,
  TRUniqueView,
} from '@entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      TRDurationDistribution,
      TRCityDistribution,
      TRUniqueView,
    ]),
    UniqueViewModule,
    CityDistributionModule,
  ],
  exports: [TimeOnSiteService],
  providers: [TimeOnSiteService],
})
export class TimeOnSiteModule {}

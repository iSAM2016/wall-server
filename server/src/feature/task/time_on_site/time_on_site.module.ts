import { Module } from '@nestjs/common';
import { TimeOnSiteService } from './time_on_site.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  exports: [TimeOnSiteService],
  providers: [TimeOnSiteService],
})
export class TimeOnSiteModule {}

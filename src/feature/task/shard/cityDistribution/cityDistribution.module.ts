import { Module } from '@nestjs/common';
import { CityDistributionService } from './cityDistribution.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TRCityDistribution } from '@entity';
@Module({
  imports: [TypeOrmModule.forFeature([TRCityDistribution])],
  exports: [CityDistributionService],
  providers: [CityDistributionService],
})
export class CityDistributionModule {}

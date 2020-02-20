import { Module } from '@nestjs/common';
import { UniqueViewService } from './uniqueView.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TRUniqueView } from '@entity';
import { CityDistributionModule } from '../cityDistribution/cityDistribution.module';
@Module({
  imports: [TypeOrmModule.forFeature([TRUniqueView]), CityDistributionModule],
  exports: [UniqueViewService],
  providers: [UniqueViewService],
})
export class UniqueViewModule {}

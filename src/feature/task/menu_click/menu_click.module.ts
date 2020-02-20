import { Module } from '@nestjs/common';
import { MenuClickService } from './menu_click.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TRBehaviorDistribution } from '@entity';
import { CityDistributionModule } from '../shard/cityDistribution/cityDistribution.module';
@Module({
  imports: [
    CityDistributionModule,
    TypeOrmModule.forFeature([TRBehaviorDistribution]),
  ],
  exports: [MenuClickService],
  providers: [MenuClickService],
})
export class MenuClickModule {}

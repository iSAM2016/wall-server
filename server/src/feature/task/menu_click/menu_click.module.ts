import { Module } from '@nestjs/common';
import { MenuClickService } from './menu_click.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TRBehaviorDistribution, TRCityDistribution } from '@entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([TRBehaviorDistribution, TRCityDistribution]),
  ],
  exports: [MenuClickService],
  providers: [MenuClickService],
})
export class MenuClickModule {}

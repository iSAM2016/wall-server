import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cat/cats.module';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [AuthModule, CatsModule, PhotoModule],
  exports: [AuthModule, CatsModule, PhotoModule],
})
export class FeatureModule {}

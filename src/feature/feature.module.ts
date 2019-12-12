import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cat/cats.module';
import { PhotoModule } from './photo/photo.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, CatsModule, PhotoModule, ChatModule],
  exports: [AuthModule, CatsModule, PhotoModule, ChatModule],
})
export class FeatureModule {}

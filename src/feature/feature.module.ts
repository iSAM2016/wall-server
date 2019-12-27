import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cat/cats.module';
import { ProjectModule } from './project/project.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, CatsModule, ProjectModule, ChatModule],
  exports: [AuthModule, CatsModule, ProjectModule, ChatModule],
})
export class FeatureModule {}

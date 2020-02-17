import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cat/cats.module';
import { ProjectModule } from './project/project.module';
import { ChatModule } from './chat/chat.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [AuthModule, CatsModule, ProjectModule, ChatModule, TaskModule],
  exports: [AuthModule, CatsModule, ProjectModule, ChatModule, TaskModule],
})
export class FeatureModule {}

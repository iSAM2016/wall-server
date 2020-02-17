import { Module } from '@nestjs/common';
import { NginxModule } from './nginx/nginx.module';
import { UvModule } from './uv/uv.module';

@Module({
  imports: [NginxModule, UvModule],
  exports: [NginxModule, UvModule],
})
export class TaskModule {}
